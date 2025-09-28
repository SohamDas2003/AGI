import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
	try {
		// Verify authentication
		const token = request.cookies.get("auth-token")?.value;
		if (!token) {
			return NextResponse.json(
				{ success: false, error: "Not authenticated" },
				{ status: 401 }
			);
		}

		const decoded = verifyToken(token);
		if (!decoded || decoded.role !== "STUDENT") {
			return NextResponse.json(
				{ success: false, error: "Not authorized" },
				{ status: 403 }
			);
		}

		const { db } = await connectToDatabase();

		// Get student details - first try to find by userId, then by email matching the JWT
		let student = await db.collection("students").findOne({
			userId: new ObjectId(decoded.userId),
		});

		// If not found by userId, try finding by email (in case student was created with email matching user)
		if (!student) {
			student = await db.collection("students").findOne({
				email: decoded.email,
			});
		}

		// If still not found, check if the user is a student role in users collection
		if (!student) {
			const user = await db.collection("users").findOne({
				_id: new ObjectId(decoded.userId),
				role: "STUDENT",
			});

			if (user) {
				// Create a virtual student record from user data
				student = {
					_id: new ObjectId(decoded.userId),
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
					course: user.course || "General", // Default course if not specified
					batchName: user.batchName || "Default",
					userId: new ObjectId(decoded.userId),
				};
			}
		}

		if (!student) {
			return NextResponse.json(
				{ success: false, error: "Student profile not found" },
				{ status: 404 }
			);
		}

		// Find assessments that match the student's criteria
		// Since we simplified to only course filtering and all assessments apply to all batches,
		// we just need to check if the student's course is in the criteria
		const assessments = await db
			.collection("assessments")
			.find({
				status: { $in: ["active", "completed"] },
				$or: [
					{ "criteria.course": { $in: [student.course] } },
					{ "criteria.course": { $size: 0 } }, // Empty array means all courses
					{ "criteria.course": { $exists: false } },
				],
			})
			.sort({ createdAt: -1 })
			.toArray();

		// Get student's responses for these assessments
		const assessmentIds = assessments.map((a) => a._id);
		const responses = await db
			.collection("assessment_responses")
			.find({
				studentId: new ObjectId(student._id),
				assessmentId: { $in: assessmentIds },
			})
			.toArray();

		// Create a map of assessment responses for quick lookup
		const responseMap = new Map();
		responses.forEach((response) => {
			const key = response.assessmentId.toString();
			if (
				!responseMap.has(key) ||
				response.attemptNumber > responseMap.get(key).attemptNumber
			) {
				responseMap.set(key, response);
			}
		});

		// Format assessments with student-specific data
		const formattedAssessments = assessments.map((assessment) => {
			const response = responseMap.get(assessment._id.toString());
			const totalQuestions =
				assessment.sections?.reduce(
					(total: number, section: { questions?: unknown[] }) =>
						total + (section.questions?.length || 0),
					0
				) || 0;

			return {
				_id: assessment._id,
				title: assessment.title,
				description: assessment.description,
				course: Array.isArray(assessment.criteria?.course)
					? assessment.criteria.course.join(", ")
					: assessment.criteria?.course || "ALL",
				batch: Array.isArray(assessment.criteria?.batches)
					? assessment.criteria.batches.join(", ")
					: assessment.criteria?.batches || "ALL",
				timeLimit: assessment.timeLimit,
				totalQuestions,
				status: assessment.status,
				instructions: assessment.instructions,
				dueDate: assessment.closedAt,
				attempts: {
					current: response?.attemptNumber || 0,
					max: assessment.maxAttempts || 1,
					allowed: assessment.allowMultipleAttempts
						? (response?.attemptNumber || 0) < (assessment.maxAttempts || 1)
						: !response || response.status !== "completed",
				},
				lastAttempt:
					response?.status === "completed"
						? {
								completedAt: response.completedAt,
								score: response.overallPercentage,
						  }
						: undefined,
			};
		});

		return NextResponse.json({
			success: true,
			assessments: formattedAssessments,
		});
	} catch (error) {
		console.error("Error fetching student assessments:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}

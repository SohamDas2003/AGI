import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ assessmentId: string }> }
) {
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

		const { assessmentId } = await params;
		if (!ObjectId.isValid(assessmentId)) {
			return NextResponse.json(
				{ success: false, error: "Invalid assessment ID" },
				{ status: 400 }
			);
		}

		const { db } = await connectToDatabase();

		// Get student details
		const student = await db.collection("students").findOne({
			userId: new ObjectId(decoded.userId),
		});

		if (!student) {
			return NextResponse.json(
				{ success: false, error: "Student not found" },
				{ status: 404 }
			);
		}

		// Get assessment details
		const assessment = await db.collection("assessments").findOne({
			_id: new ObjectId(assessmentId),
		});

		if (!assessment) {
			return NextResponse.json(
				{ success: false, error: "Assessment not found" },
				{ status: 404 }
			);
		}

		// Check if student is eligible for this assessment
		// With simplified criteria, just check if student's course is in the criteria or if criteria is empty
		const isEligible =
			assessment.criteria?.course?.includes(student.course) ||
			!assessment.criteria?.course?.length;

		if (!isEligible) {
			return NextResponse.json(
				{ success: false, error: "Not authorized to view this assessment" },
				{ status: 403 }
			);
		}

		// Get student's response for this assessment
		const response = await db.collection("assessment_responses").findOne(
			{
				studentId: new ObjectId(student._id),
				assessmentId: new ObjectId(assessmentId),
			},
			{
				sort: { attemptNumber: -1 }, // Get latest attempt
			}
		);

		// Format the assessment data
		const formattedAssessment = {
			_id: assessment._id,
			title: assessment.title,
			description: assessment.description,
			instructions: assessment.instructions,
			timeLimit: assessment.timeLimit,
			isPublished: assessment.status === "active",
			createdAt: assessment.createdAt,
			updatedAt: assessment.updatedAt,
			sections: assessment.sections || [],
			isAssigned: isEligible && assessment.status === "active",
			isCompleted: response?.status === "completed",
			hasStarted:
				response?.status === "in_progress" || response?.status === "completed",
			attempts: response?.attemptNumber || 0,
			lastAttemptAt: response?.startedAt,
		};

		return NextResponse.json({
			success: true,
			assessment: formattedAssessment,
		});
	} catch (error) {
		console.error("Error fetching assessment details:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}

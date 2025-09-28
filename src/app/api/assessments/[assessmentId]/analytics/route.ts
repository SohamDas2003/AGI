import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getTokenFromRequest, verifyToken } from "@/lib/jwt";
import { ObjectId } from "mongodb";

export async function GET(
	request: NextRequest,
	{ params }: { params: { assessmentId: string } }
) {
	try {
		// Verify authentication
		const token = getTokenFromRequest(request);
		if (!token) {
			return NextResponse.json(
				{ success: false, error: "Not authenticated" },
				{ status: 401 }
			);
		}

		const decoded = verifyToken(token);
		if (
			!decoded ||
			(decoded.role !== "ADMIN" && decoded.role !== "SUPERADMIN")
		) {
			return NextResponse.json(
				{ success: false, error: "Not authorized" },
				{ status: 403 }
			);
		}

		const { assessmentId } = params;

		if (!ObjectId.isValid(assessmentId)) {
			return NextResponse.json(
				{ success: false, error: "Invalid assessment ID" },
				{ status: 400 }
			);
		}

		const { db } = await connectToDatabase();

		// Get the assessment
		const assessment = await db
			.collection("assessments")
			.findOne({ _id: new ObjectId(assessmentId) });

		if (!assessment) {
			return NextResponse.json(
				{ success: false, error: "Assessment not found" },
				{ status: 404 }
			);
		}

		// Calculate real-time statistics
		const studentsCollection = db.collection("students");
		const responsesCollection = db.collection("assessment_responses");

		// Find eligible students based on assessment criteria
		const eligibleStudentsQuery: { course?: { $in: string[] } } = {};

		if (assessment.criteria?.course && assessment.criteria.course.length > 0) {
			eligibleStudentsQuery.course = { $in: assessment.criteria.course };
		}

		const eligibleStudents = await studentsCollection
			.find(eligibleStudentsQuery)
			.toArray();

		const totalEligibleStudents = eligibleStudents.length;

		// Get all responses for this assessment
		const responses = await responsesCollection
			.find({ assessmentId: new ObjectId(assessmentId) })
			.toArray();

		// Calculate stats
		const totalAssigned = totalEligibleStudents; // All eligible are considered assigned
		const totalStarted = responses.filter(
			(r) => r.status !== "not_started"
		).length;
		const totalCompleted = responses.filter(
			(r) => r.status === "completed"
		).length;
		const completionRate =
			totalAssigned > 0 ? (totalCompleted / totalAssigned) * 100 : 0;

		// Calculate average score and time spent for completed responses
		const completedResponses = responses.filter(
			(r) => r.status === "completed"
		);
		const averageScore =
			completedResponses.length > 0
				? completedResponses.reduce((sum, r) => sum + (r.score || 0), 0) /
				  completedResponses.length
				: 0;

		const averageTimeSpent =
			completedResponses.length > 0
				? completedResponses.reduce((sum, r) => sum + (r.timeSpent || 0), 0) /
				  completedResponses.length
				: 0;

		// Get detailed student assignment info
		const studentDetails = await Promise.all(
			eligibleStudents.map(async (student) => {
				const studentResponse = responses.find(
					(r) => r.studentId.toString() === student._id.toString()
				);

				return {
					_id: student._id,
					name: `${student.firstName} ${student.lastName}`,
					email: student.email,
					course: student.course,
					batchName: student.batchName,
					status: studentResponse?.status || "not_started",
					score: studentResponse?.score || null,
					timeSpent: studentResponse?.timeSpent || null,
					startedAt: studentResponse?.startedAt || null,
					completedAt: studentResponse?.completedAt || null,
					lastAttempt: studentResponse?.updatedAt || null,
				};
			})
		);

		// Update assessment stats in database
		const updatedStats = {
			totalEligibleStudents,
			totalAssigned,
			totalStarted,
			totalCompleted,
			completionRate: Math.round(completionRate * 10) / 10,
			averageScore: Math.round(averageScore * 10) / 10,
			averageTimeSpent: Math.round(averageTimeSpent),
		};

		await db.collection("assessments").updateOne(
			{ _id: new ObjectId(assessmentId) },
			{
				$set: {
					stats: updatedStats,
					updatedAt: new Date(),
				},
			}
		);

		return NextResponse.json({
			success: true,
			assessment: {
				...assessment,
				stats: updatedStats,
			},
			students: studentDetails,
		});
	} catch (error) {
		console.error("Error fetching assessment analytics:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}

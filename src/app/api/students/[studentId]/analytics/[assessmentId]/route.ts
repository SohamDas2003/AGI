import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getTokenFromRequest, verifyToken } from "@/lib/jwt";
import { ObjectId } from "mongodb";

export async function GET(
	request: NextRequest,
	{
		params,
	}: {
		params: Promise<{ studentId: string; assessmentId: string }>;
	}
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

		const { studentId, assessmentId } = await params;

		if (!ObjectId.isValid(studentId) || !ObjectId.isValid(assessmentId)) {
			return NextResponse.json(
				{ success: false, error: "Invalid student or assessment ID" },
				{ status: 400 }
			);
		}

		const { db } = await connectToDatabase();

		// Get student details
		const student = await db
			.collection("students")
			.findOne({ _id: new ObjectId(studentId) });

		if (!student) {
			return NextResponse.json(
				{ success: false, error: "Student not found" },
				{ status: 404 }
			);
		}

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

		// Get student's response
		const response = await db.collection("assessment_responses").findOne({
			assessmentId: new ObjectId(assessmentId),
			studentId: new ObjectId(studentId),
		});

		if (!response || response.status !== "completed") {
			return NextResponse.json({
				success: true,
				student: {
					_id: student._id,
					name: `${student.firstName} ${student.lastName}`,
					email: student.email,
					course: student.course,
					batchName: student.batchName,
				},
				assessment: {
					_id: assessment._id,
					title: assessment.title,
				},
				response: null,
				message: "Student has not completed this assessment",
			});
		}

		// Build detailed analytics
		const analytics = {
			student: {
				_id: student._id,
				name: `${student.firstName} ${student.lastName}`,
				email: student.email,
				course: student.course,
				batchName: student.batchName,
			},
			assessment: {
				_id: assessment._id,
				title: assessment.title,
				description: assessment.description,
			},
			performance: {
				overallPercentage: response.overallPercentage || 0,
				overallAverageRating: response.overallAverageRating || 0,
				timeSpent: response.timeSpent || 0,
				completedAt: response.completedAt,
				status: response.status,
			},
			sectionPerformance: response.sectionScores || [],
			weakSections: (response.sectionScores || [])
				.filter((ss: { percentage: number }) => ss.percentage < 60)
				.sort(
					(a: { percentage: number }, b: { percentage: number }) =>
						a.percentage - b.percentage
				),
			strongSections: (response.sectionScores || [])
				.filter((ss: { percentage: number }) => ss.percentage >= 80)
				.sort(
					(a: { percentage: number }, b: { percentage: number }) =>
						b.percentage - a.percentage
				),
		};

		return NextResponse.json({
			success: true,
			analytics,
		});
	} catch (error) {
		console.error("Error fetching student analytics:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}

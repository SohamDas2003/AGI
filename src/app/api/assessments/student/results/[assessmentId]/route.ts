import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest, verifyToken } from "@/lib/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ assessmentId: string }> }
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
		let student = await db.collection("students").findOne({
			userId: new ObjectId(decoded.userId),
		});

		if (!student) {
			student = await db.collection("students").findOne({
				email: decoded.email,
			});
		}

		if (!student) {
			return NextResponse.json(
				{ success: false, error: "Student profile not found" },
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

		// Find the completed response
		const response = await db.collection("assessment_responses").findOne({
			assessmentId: new ObjectId(assessmentId),
			studentId: new ObjectId(student._id),
			status: "completed",
		});

		if (!response) {
			return NextResponse.json(
				{
					success: false,
					error:
						"No completed assessment found. Please complete the assessment first.",
				},
				{ status: 404 }
			);
		}

		// Convert answers object back to array format for the frontend
		// Ensure question IDs match the format in sections
		const answersArray = Object.entries(response.answers || {}).map(
			([questionId, value]) => ({
				questionId: questionId.toString(),
				value: value as number,
			})
		);

		// Normalize section question IDs to strings for consistent comparison
		const normalizedSections = assessment.sections.map(
			(section: {
				_id?: ObjectId;
				id?: string;
				title?: string;
				description?: string;
				questions: Array<{
					_id?: ObjectId;
					id?: string;
					text?: string;
					isRequired?: boolean;
					scaleOptions?: unknown;
				}>;
			}) => ({
				...section,
				_id: (section._id?.toString() || section.id) as string,
				questions: section.questions.map((q) => ({
					...q,
					_id: (q._id?.toString() || q.id) as string,
				})),
			})
		);

		return NextResponse.json({
			success: true,
			response: {
				_id: response._id,
				assessmentId: response.assessmentId,
				studentId: response.studentId,
				answers: answersArray,
				timeSpent: response.timeSpent || 0,
				submittedAt: response.completedAt || response.updatedAt,
				isCompleted: true,
				overallPercentage: response.overallPercentage || 0,
				overallAverageRating: response.overallAverageRating || 0,
				sectionScores: response.sectionScores || [],
				assessment: {
					_id: assessment._id.toString(),
					title: assessment.title,
					description: assessment.description,
					sections: normalizedSections,
					timeLimit: assessment.timeLimit,
				},
			},
		});
	} catch (error) {
		console.error("Error fetching assessment results:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}

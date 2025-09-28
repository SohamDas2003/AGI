import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest, verifyToken } from "@/lib/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface Answer {
	questionId: string;
	value: number;
}

export async function POST(
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

		const body = await request.json();
		const {
			answers,
			timeSpent,
			isAutoSubmit,
		}: {
			answers: Answer[];
			timeSpent?: number;
			isAutoSubmit?: boolean;
		} = body;

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
			const user = await db.collection("users").findOne({
				_id: new ObjectId(decoded.userId),
				role: "STUDENT",
			});

			if (user) {
				student = {
					_id: new ObjectId(decoded.userId),
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
					course: user.course || "General",
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

		// Find the current response record
		const responseRecord = await db.collection("assessment_responses").findOne({
			assessmentId: new ObjectId(assessmentId),
			studentId: new ObjectId(student._id),
			status: "in_progress",
		});

		if (!responseRecord) {
			return NextResponse.json(
				{ success: false, error: "No active assessment session found" },
				{ status: 400 }
			);
		}

		// Calculate score (simple percentage based on scale)
		let totalScore = 0;
		let maxPossibleScore = 0;
		const answerMap = new Map<string, number>();

		// Create answer map for easy lookup
		answers.forEach((answer) => {
			answerMap.set(answer.questionId, answer.value);
		});

		// Calculate score based on assessment structure
		assessment.sections.forEach(
			(section: {
				questions: Array<{
					_id?: ObjectId;
					scale?: { min?: number; max?: number };
				}>;
			}) => {
				section.questions.forEach((question) => {
					const questionId = question._id?.toString();
					if (questionId && answerMap.has(questionId)) {
						const answer = answerMap.get(questionId) || 0;
						const min = question.scale?.min || 1;
						const max = question.scale?.max || 5;

						// Normalize score to 0-100 scale
						const normalizedScore = ((answer - min) / (max - min)) * 100;
						totalScore += normalizedScore;
						maxPossibleScore += 100;
					}
				});
			}
		);

		const overallPercentage =
			maxPossibleScore > 0
				? Math.round((totalScore / maxPossibleScore) * 100)
				: 0;

		// Update the response record
		const updateData = {
			status: "completed",
			completedAt: new Date(),
			updatedAt: new Date(),
			answers: Object.fromEntries(answerMap),
			timeSpent: timeSpent || 0,
			score: totalScore,
			maxScore: maxPossibleScore,
			overallPercentage,
			isAutoSubmit: isAutoSubmit || false,
		};

		await db
			.collection("assessment_responses")
			.updateOne({ _id: responseRecord._id }, { $set: updateData });

		// Update assessment stats (optional - could be done in background)
		try {
			const allResponses = await db
				.collection("assessment_responses")
				.find({ assessmentId: new ObjectId(assessmentId) })
				.toArray();

			const completed = allResponses.filter((r) => r.status === "completed");
			const started = allResponses.filter((r) => r.status !== "not_started");

			const avgScore =
				completed.length > 0
					? completed.reduce((sum, r) => sum + (r.overallPercentage || 0), 0) /
					  completed.length
					: 0;

			const avgTime =
				completed.length > 0
					? completed.reduce((sum, r) => sum + (r.timeSpent || 0), 0) /
					  completed.length
					: 0;

			await db.collection("assessments").updateOne(
				{ _id: new ObjectId(assessmentId) },
				{
					$set: {
						"stats.totalStarted": started.length,
						"stats.totalCompleted": completed.length,
						"stats.averageScore": Math.round(avgScore * 10) / 10,
						"stats.averageTimeSpent": Math.round(avgTime),
						"stats.completionRate":
							started.length > 0
								? Math.round((completed.length / started.length) * 100 * 10) /
								  10
								: 0,
					},
				}
			);
		} catch (statsError) {
			console.error("Error updating assessment stats:", statsError);
			// Don't fail the submission if stats update fails
		}

		return NextResponse.json({
			success: true,
			message: isAutoSubmit
				? "Assessment auto-submitted"
				: "Assessment submitted successfully",
			results: {
				overallPercentage,
				totalQuestions: answers.length,
				timeSpent: timeSpent || 0,
				completedAt: new Date().toISOString(),
			},
		});
	} catch (error) {
		console.error("Error submitting assessment:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}

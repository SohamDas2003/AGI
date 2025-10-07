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

		// Calculate score with section-wise breakdown
		let totalScore = 0;
		let maxPossibleScore = 0;
		const answerMap = new Map<string, number>();
		const sectionScores: Array<{
			sectionId: string;
			sectionTitle: string;
			score: number;
			maxPossibleScore: number;
			percentage: number;
			averageRating: number;
			questionsAnswered: number;
			totalQuestions: number;
		}> = [];

		// Create answer map for easy lookup - normalize all IDs to strings
		answers.forEach((answer) => {
			answerMap.set(answer.questionId.toString(), answer.value);
		});

		// Calculate score based on assessment structure with section breakdown
		assessment.sections.forEach(
			(section: {
				_id?: ObjectId;
				id?: string;
				title?: string;
				questions: Array<{
					_id?: ObjectId;
					id?: string;
					scaleOptions?: { min?: number; max?: number };
				}>;
			}) => {
				let sectionScore = 0;
				let sectionMaxScore = 0;
				let sectionRatingSum = 0;
				let questionsAnswered = 0;

				section.questions.forEach((question) => {
					// Normalize question ID to string for lookup
					const questionId = question._id
						? question._id.toString()
						: question.id?.toString();
					const min = question.scaleOptions?.min || 1;
					const max = question.scaleOptions?.max || 5;

					if (questionId && answerMap.has(questionId)) {
						const answer = answerMap.get(questionId) || 0;

						// Normalize score to 0-100 scale
						const normalizedScore = ((answer - min) / (max - min)) * 100;
						sectionScore += normalizedScore;
						sectionMaxScore += 100;
						sectionRatingSum += answer;
						questionsAnswered++;
					}
				});

				const sectionPercentage =
					sectionMaxScore > 0
						? Math.round((sectionScore / sectionMaxScore) * 100 * 10) / 10
						: 0;

				const averageRating =
					questionsAnswered > 0
						? Math.round((sectionRatingSum / questionsAnswered) * 10) / 10
						: 0;

				sectionScores.push({
					sectionId: section._id
						? section._id.toString()
						: section.id?.toString() || "",
					sectionTitle: section.title || "Untitled Section",
					score: Math.round(sectionScore * 10) / 10,
					maxPossibleScore: sectionMaxScore,
					percentage: sectionPercentage,
					averageRating: averageRating,
					questionsAnswered: questionsAnswered,
					totalQuestions: section.questions.length,
				});

				totalScore += sectionScore;
				maxPossibleScore += sectionMaxScore;
			}
		);

		const overallPercentage =
			maxPossibleScore > 0
				? Math.round((totalScore / maxPossibleScore) * 100 * 10) / 10
				: 0;

		const overallAverageRating =
			answers.length > 0
				? Math.round(
						(answers.reduce((sum, ans) => sum + ans.value, 0) /
							answers.length) *
							10
				  ) / 10
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
			overallAverageRating,
			sectionScores: sectionScores,
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

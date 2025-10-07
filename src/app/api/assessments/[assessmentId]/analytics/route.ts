import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getTokenFromRequest, verifyToken } from "@/lib/jwt";
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
		if (
			!decoded ||
			(decoded.role !== "ADMIN" && decoded.role !== "SUPERADMIN")
		) {
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

		const averagePercentage =
			completedResponses.length > 0
				? completedResponses.reduce(
						(sum, r) => sum + (r.overallPercentage || 0),
						0
				  ) / completedResponses.length
				: 0;

		const averageRating =
			completedResponses.length > 0
				? completedResponses.reduce(
						(sum, r) => sum + (r.overallAverageRating || 0),
						0
				  ) / completedResponses.length
				: 0;

		const averageTimeSpent =
			completedResponses.length > 0
				? completedResponses.reduce((sum, r) => sum + (r.timeSpent || 0), 0) /
				  completedResponses.length
				: 0;

		// Calculate section-wise analytics
		const studentMap = new Map(
			eligibleStudents.map((s) => [s._id.toString(), s])
		);

		const sectionAnalytics = assessment.sections.map(
			(section: {
				_id?: ObjectId;
				id?: string;
				title?: string;
				description?: string;
				questions: Array<unknown>;
			}) => {
				const sectionId = (section._id?.toString() || section.id) as string;
				const sectionTitle = section.title || "Untitled Section";

				// Collect all section scores from completed responses
				const sectionScores = completedResponses
					.map((r) => {
						const sectionScore = r.sectionScores?.find(
							(ss: { sectionId: string }) => ss.sectionId === sectionId
						);
						return sectionScore
							? { ...sectionScore, studentId: r.studentId }
							: null;
					})
					.filter((ss) => ss !== null);

				if (sectionScores.length === 0) {
					return {
						sectionId,
						sectionTitle,
						sectionDescription: section.description || "",
						totalQuestions: section.questions.length,
						responseCount: 0,
						averageScore: 0,
						averagePercentage: 0,
						averageRating: 0,
						studentsBelowThreshold: 0,
						studentsNeedingAttention: [],
					};
				}

				const avgSectionPercentage =
					sectionScores.reduce((sum, ss) => sum + (ss?.percentage || 0), 0) /
					sectionScores.length;
				const avgSectionRating =
					sectionScores.reduce((sum, ss) => sum + (ss?.averageRating || 0), 0) /
					sectionScores.length;

				// Find students who scored below 60% in this section (need attention)
				const studentsNeedingAttention = sectionScores
					.filter((ss) => ss && ss.percentage < 60)
					.map((ss) => {
						if (!ss) return null;
						const student = studentMap.get(ss.studentId.toString());
						return {
							studentId: ss.studentId,
							studentName: student
								? `${student.firstName} ${student.lastName}`
								: "Unknown",
							email: student?.email || "",
							course: student?.course || "",
							batchName: student?.batchName || "",
							percentage: ss.percentage,
							averageRating: ss.averageRating,
							questionsAnswered: ss.questionsAnswered,
							totalQuestions: ss.totalQuestions,
						};
					})
					.filter((s) => s !== null)
					.sort((a, b) => (a?.percentage || 0) - (b?.percentage || 0));

				return {
					sectionId,
					sectionTitle,
					sectionDescription: section.description || "",
					totalQuestions: section.questions.length,
					responseCount: sectionScores.length,
					averagePercentage: Math.round(avgSectionPercentage * 10) / 10,
					averageRating: Math.round(avgSectionRating * 10) / 10,
					studentsBelowThreshold: studentsNeedingAttention.length,
					studentsNeedingAttention,
				};
			}
		);

		// Get detailed student assignment info with section breakdown
		const studentDetails = await Promise.all(
			eligibleStudents.map(async (student) => {
				const studentResponse = responses.find(
					(r) => r.studentId.toString() === student._id.toString()
				);

				const sectionBreakdown =
					studentResponse?.sectionScores?.map(
						(ss: {
							sectionId: string;
							sectionTitle: string;
							percentage: number;
							averageRating: number;
						}) => ({
							sectionId: ss.sectionId,
							sectionTitle: ss.sectionTitle,
							percentage: ss.percentage,
							averageRating: ss.averageRating,
							needsAttention: ss.percentage < 60,
						})
					) || [];

				const sectionsNeedingAttention = sectionBreakdown
					.filter((sb: { needsAttention: boolean }) => sb.needsAttention)
					.map((sb: { sectionTitle: string }) => sb.sectionTitle);

				return {
					_id: student._id,
					name: `${student.firstName} ${student.lastName}`,
					email: student.email,
					course: student.course,
					batchName: student.batchName,
					status: studentResponse?.status || "not_started",
					overallPercentage: studentResponse?.overallPercentage || null,
					overallAverageRating: studentResponse?.overallAverageRating || null,
					timeSpent: studentResponse?.timeSpent || null,
					startedAt: studentResponse?.startedAt || null,
					completedAt: studentResponse?.completedAt || null,
					lastAttempt: studentResponse?.updatedAt || null,
					sectionBreakdown,
					sectionsNeedingAttention,
					needsAttention:
						studentResponse?.status === "completed" &&
						(studentResponse?.overallPercentage || 0) < 60,
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
			averagePercentage: Math.round(averagePercentage * 10) / 10,
			averageRating: Math.round(averageRating * 10) / 10,
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

		// Sort students by overall percentage for prioritization
		const sortedStudents = [...studentDetails].sort((a, b) => {
			if (a.status !== "completed" && b.status !== "completed") return 0;
			if (a.status !== "completed") return 1;
			if (b.status !== "completed") return -1;
			return (a.overallPercentage || 0) - (b.overallPercentage || 0);
		});

		// Sort sections by average percentage to identify weakest sections
		const sectionsRanked = [...sectionAnalytics].sort(
			(a, b) => a.averagePercentage - b.averagePercentage
		);

		return NextResponse.json({
			success: true,
			assessment: {
				...assessment,
				stats: updatedStats,
			},
			students: sortedStudents,
			sectionAnalytics,
			sectionsRanked,
			studentsNeedingAttention: studentDetails.filter((s) => s.needsAttention),
		});
	} catch (error) {
		console.error("Error fetching assessment analytics:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}

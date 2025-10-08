
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { AssessmentAnalytics, AssessmentResponse } from "@/models/Assessment";

export async function GET() {
	try {
		// Connect to database
		const { db } = await connectToDatabase();
		const analyticsCollection = db.collection<AssessmentAnalytics>(
			"assessment_analytics"
		);
		const responsesCollection = db.collection<AssessmentResponse>(
			"assessment_responses"
		);
	// studentsCollection no longer needed for status counts (using responses)

		// Calculate status counts from assessment_responses collection instead of
		// relying on students.assessmentStatus. This ensures analytics reflect
		// actual submissions immediately when a student completes an assessment.
		const responseStatusCounts = await responsesCollection
			.aggregate([
				{ $group: { _id: "$status", count: { $sum: 1 } } },
			])
			.toArray();

		const getResponseStatusCount = (status: string) => {
			const found = responseStatusCounts.find((item) => item._id === status);
			return found ? found.count : 0;
		};

		// Map response statuses to analytics fields. Note: 'not_started' in
		// assessment_responses approximates assigned, 'in_progress' approximates
		// started, and 'completed' is completed.
		const totalAssigned = getResponseStatusCount("not_started");
		const totalStarted = getResponseStatusCount("in_progress");
		const totalCompleted = getResponseStatusCount("completed");

		// Fetch all analytics data
		const allAnalytics = await analyticsCollection.find({}).toArray();

		// Calculate combined metrics
		const totalAssessments = allAnalytics.length;
		const totalEligibleStudents = allAnalytics.reduce(
			(sum, doc) => sum + (doc.totalEligibleStudents || 0),
			0
		);

		// Calculate overall average score (weighted by number of completed assessments)
		const totalWeightedScore = allAnalytics.reduce(
			(sum, doc) =>
				sum + (doc.overallAverageScore || 0) * (doc.totalCompleted || 0),
			0
		);
		const overallAverageScore =
			totalCompleted > 0 ? totalWeightedScore / totalCompleted : 0;

		// Calculate overall completion rate
		const overallCompletionRate =
			totalAssigned > 0 ? (totalCompleted / totalAssigned) * 100 : 0;

		// Calculate placement recommendation rate
		const placementThreshold = 70;
		const latestStudentResponses = await responsesCollection
			.aggregate([
				{ $sort: { studentId: 1, submittedAt: -1 } },
				{
					$group: {
						_id: "$studentId",
						latestResponse: { $first: "$$ROOT" },
					},
				},
			])
			.toArray();

		const recommendedStudents = latestStudentResponses.filter(
			(res) => (res.latestResponse.overallScore || 0) >= placementThreshold
		).length;

		const placementRecommendationRate =
			latestStudentResponses.length > 0
				? (recommendedStudents / latestStudentResponses.length) * 100
				: 0;

		// Set percentage changes to 0 as historical data is not available
		const totalStudentsChange = 0;
		const activeAssessmentsChange = 0;
		const completedAssessmentsChange = 0;
		const averageOverallScoreChange = 0;
		const placementRecommendationRateChange = 0;

		// Prepare response
		const response = {
			success: true,
			metrics: {
				totalAssessments,
				totalEligibleStudents,
				totalAssigned,
				totalStarted,
				totalCompleted,
				overallAverageScore,
				overallCompletionRate,
				placementRecommendationRate,
				totalStudentsChange,
				activeAssessmentsChange,
				completedAssessmentsChange,
				averageOverallScoreChange,
				placementRecommendationRateChange,
			},
		};

		return NextResponse.json(response);
	} catch (error) {
		console.error("Error fetching analytics:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST() {
	try {
		const { db } = await connectToDatabase();

		// Create a simple test assessment
		const assessment = {
			title: "Test Assessment - Debug",
			description: "This is a test assessment for debugging",
			sections: [
				{
					id: new ObjectId().toString(),
					title: "Test Section",
					description: "Test section description",
					order: 1,
					questions: [
						{
							id: new ObjectId().toString(),
							text: "This is a test question",
							questionType: "scale",
							scaleOptions: {
								min: 1,
								max: 5,
								minLabel: "Strongly Disagree",
								maxLabel: "Strongly Agree",
								labels: [
									"Strongly Disagree",
									"Disagree",
									"Neutral",
									"Agree",
									"Strongly Agree",
								],
							},
							order: 1,
							isRequired: true,
						},
					],
				},
			],
			criteria: {
				course: ["MCA", "MMS"], // Target specific courses
				batches: [],
				sites: [],
				academicSessions: [],
				classes: [],
				studentStatus: ["Active"],
			},
			status: "active",
			timeLimit: 30,
			instructions: "Please answer all questions honestly.",
			allowMultipleAttempts: false,
			maxAttempts: 1,
			autoAssign: true,
			assignOnLogin: false,
			createdBy: new ObjectId(), // Dummy admin ID
			createdAt: new Date(),
			updatedAt: new Date(),
			publishedAt: new Date(),
			stats: {
				totalEligibleStudents: 0,
				totalAssigned: 0,
				totalStarted: 0,
				totalCompleted: 0,
				completionRate: 0,
				averageScore: 0,
				averageTimeSpent: 0,
			},
		};

		const result = await db.collection("assessments").insertOne(assessment);

		return NextResponse.json({
			success: true,
			message: "Test assessment created",
			assessmentId: result.insertedId,
		});
	} catch (error) {
		console.error("Error creating test assessment:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}

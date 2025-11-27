import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest, verifyToken } from "@/lib/jwt-edge";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface ScaleOptions {
	min: number;
	max: number;
	minLabel: string;
	maxLabel: string;
	labels: string[];
}

interface CreateQuestionData {
	text: string;
	isRequired?: boolean;
	scaleOptions?: ScaleOptions;
}

interface CreateSectionData {
	title: string;
	description?: string;
	questions: CreateQuestionData[];
}

export async function POST(request: NextRequest) {
	try {
		// Verify authentication
		const token = getTokenFromRequest(request);
		if (!token) {
			return NextResponse.json(
				{ success: false, error: "Not authenticated" },
				{ status: 401 }
			);
		}

		const decoded = await verifyToken(token);
		if (
			!decoded ||
			(decoded.role !== "ADMIN" && decoded.role !== "SUPERADMIN")
		) {
			return NextResponse.json(
				{ success: false, error: "Not authorized" },
				{ status: 403 }
			);
		}

		const assessmentData = await request.json();

		// Validate required fields
		if (!assessmentData.title) {
			return NextResponse.json(
				{ success: false, error: "Assessment title is required" },
				{ status: 400 }
			);
		}

		if (!assessmentData.sections || assessmentData.sections.length === 0) {
			return NextResponse.json(
				{ success: false, error: "At least one section is required" },
				{ status: 400 }
			);
		}

		const { db } = await connectToDatabase();

		// Prepare assessment document
		const assessment = {
			title: assessmentData.title,
			description: assessmentData.description || "",
			sections: assessmentData.sections.map(
				(section: CreateSectionData, sectionIndex: number) => ({
					id: new ObjectId().toString(),
					title: section.title,
					description: section.description || "",
					order: sectionIndex + 1,
					questions: section.questions.map(
						(question: CreateQuestionData, questionIndex: number) => ({
							id: new ObjectId().toString(),
							text: question.text,
							questionType: "scale",
							scaleOptions: question.scaleOptions || {
								min: 1,
								max: 5,
								minLabel: "Beginner",
								maxLabel: "Expert",
								labels: [
									"Beginner",
									"Elementary",
									"Intermediate",
									"Advanced",
									"Expert",
								],
							},
							order: questionIndex + 1,
							isRequired: question.isRequired || false,
						})
					),
				})
			),
			criteria: {
				course: assessmentData.criteria?.course || [],
				pgdmSpecializations: assessmentData.criteria?.pgdmSpecializations || [],
				batches: [], // Always empty - assessment applies to all batches
				sites: [],
				academicSessions: [],
				classes: [],
				studentStatus: ["Active"], // Always active students only
			},
			status: "active", // Set as active by default
			timeLimit: assessmentData.timeLimit,
			instructions: assessmentData.instructions || "",
			allowMultipleAttempts: assessmentData.allowMultipleAttempts || false,
			maxAttempts: assessmentData.maxAttempts || 1,
			autoAssign: assessmentData.autoAssign || false,
			assignOnLogin: assessmentData.assignOnLogin || false,
			createdBy: new ObjectId(decoded.userId),
			createdAt: new Date(),
			updatedAt: new Date(),
			publishedAt: new Date(),
		};

		// Insert the assessment
		const result = await db.collection("assessments").insertOne(assessment);

		if (result.insertedId) {
			// Calculate stats (will be computed on demand)
			const stats = {
				totalEligibleStudents: 0,
				totalAssigned: 0,
				totalStarted: 0,
				totalCompleted: 0,
				completionRate: 0,
				averageScore: 0,
				averageTimeSpent: 0,
			};

			// Update assessment with stats
			await db
				.collection("assessments")
				.updateOne({ _id: result.insertedId }, { $set: { stats } });

			return NextResponse.json({
				success: true,
				message: "Assessment created successfully",
				assessmentId: result.insertedId,
			});
		} else {
			return NextResponse.json(
				{ success: false, error: "Failed to create assessment" },
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error("Error creating assessment:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function GET(request: NextRequest) {
	try {
		// Verify authentication
		const token = getTokenFromRequest(request);
		if (!token) {
			return NextResponse.json(
				{ success: false, error: "Not authenticated" },
				{ status: 401 }
			);
		}

		const decoded = await verifyToken(token);
		if (
			!decoded ||
			(decoded.role !== "ADMIN" && decoded.role !== "SUPERADMIN")
		) {
			return NextResponse.json(
				{ success: false, error: "Not authorized" },
				{ status: 403 }
			);
		}

		const { db } = await connectToDatabase();

		// Get all assessments created by admin
		const assessments = await db
			.collection("assessments")
			.find({})
			.sort({ createdAt: -1 })
			.toArray();

		// Format assessments for admin view
		const formattedAssessments = assessments.map((assessment) => ({
			_id: assessment._id,
			title: assessment.title,
			description: assessment.description,
			status: assessment.status,
			createdAt: assessment.createdAt,
			updatedAt: assessment.updatedAt,
			criteria: assessment.criteria,
			timeLimit: assessment.timeLimit,
			totalSections: assessment.sections?.length || 0,
			totalQuestions:
				assessment.sections?.reduce(
					(total: number, section: { questions?: unknown[] }) =>
						total + (section.questions?.length || 0),
					0
				) || 0,
			stats: assessment.stats || {
				totalEligibleStudents: 0,
				totalAssigned: 0,
				totalStarted: 0,
				totalCompleted: 0,
				completionRate: 0,
				averageScore: 0,
				averageTimeSpent: 0,
			},
		}));

		return NextResponse.json({
			success: true,
			assessments: formattedAssessments,
		});
	} catch (error) {
		console.error("Error fetching assessments:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}

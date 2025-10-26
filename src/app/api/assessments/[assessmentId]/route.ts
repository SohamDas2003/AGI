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

interface Question {
	id?: string;
	text: string;
	isRequired?: boolean;
	scaleOptions?: ScaleOptions;
}

interface Section {
	id?: string;
	title: string;
	description?: string;
	questions: Question[];
}

// GET single assessment
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

		const { assessmentId } = await params;

		if (!ObjectId.isValid(assessmentId)) {
			return NextResponse.json(
				{ success: false, error: "Invalid assessment ID" },
				{ status: 400 }
			);
		}

		const { db } = await connectToDatabase();

		const assessment = await db
			.collection("assessments")
			.findOne({ _id: new ObjectId(assessmentId) });

		if (!assessment) {
			return NextResponse.json(
				{ success: false, error: "Assessment not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			assessment,
		});
	} catch (error) {
		console.error("Error fetching assessment:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}

// PUT - Update assessment
export async function PUT(
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

		const { assessmentId } = await params;

		if (!ObjectId.isValid(assessmentId)) {
			return NextResponse.json(
				{ success: false, error: "Invalid assessment ID" },
				{ status: 400 }
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

		// Check if assessment exists
		const existingAssessment = await db
			.collection("assessments")
			.findOne({ _id: new ObjectId(assessmentId) });

		if (!existingAssessment) {
			return NextResponse.json(
				{ success: false, error: "Assessment not found" },
				{ status: 404 }
			);
		}

		// Prepare updated assessment document
		const updatedAssessment = {
			title: assessmentData.title,
			description: assessmentData.description || "",
			sections: assessmentData.sections.map(
				(section: Section, sectionIndex: number) => ({
					id: section.id || new ObjectId().toString(),
					title: section.title,
					description: section.description || "",
					order: sectionIndex + 1,
					questions: section.questions.map(
						(question: Question, questionIndex: number) => ({
							id: question.id || new ObjectId().toString(),
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
				batches: [],
				sites: [],
				academicSessions: [],
				classes: [],
				studentStatus: ["Active"],
			},
			timeLimit: assessmentData.timeLimit,
			instructions: assessmentData.instructions || "",
			allowMultipleAttempts: assessmentData.allowMultipleAttempts || false,
			maxAttempts: assessmentData.maxAttempts || 1,
			autoAssign: assessmentData.autoAssign || false,
			assignOnLogin: assessmentData.assignOnLogin || false,
			updatedAt: new Date(),
		};

		// Update the assessment
		const result = await db
			.collection("assessments")
			.updateOne(
				{ _id: new ObjectId(assessmentId) },
				{ $set: updatedAssessment }
			);

		if (result.modifiedCount > 0 || result.matchedCount > 0) {
			return NextResponse.json({
				success: true,
				message: "Assessment updated successfully",
				assessmentId: assessmentId,
			});
		} else {
			return NextResponse.json(
				{ success: false, error: "Failed to update assessment" },
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error("Error updating assessment:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}

// DELETE assessment
export async function DELETE(
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

		const { assessmentId } = await params;

		if (!ObjectId.isValid(assessmentId)) {
			return NextResponse.json(
				{ success: false, error: "Invalid assessment ID" },
				{ status: 400 }
			);
		}

		const { db } = await connectToDatabase();

		// Check if assessment exists
		const existingAssessment = await db
			.collection("assessments")
			.findOne({ _id: new ObjectId(assessmentId) });

		if (!existingAssessment) {
			return NextResponse.json(
				{ success: false, error: "Assessment not found" },
				{ status: 404 }
			);
		}

		// Delete the assessment
		const result = await db
			.collection("assessments")
			.deleteOne({ _id: new ObjectId(assessmentId) });

		if (result.deletedCount > 0) {
			// Also delete related responses (optional - you might want to keep them for historical purposes)
			await db
				.collection("assessmentResponses")
				.deleteMany({ assessmentId: new ObjectId(assessmentId) });

			return NextResponse.json({
				success: true,
				message: "Assessment deleted successfully",
			});
		} else {
			return NextResponse.json(
				{ success: false, error: "Failed to delete assessment" },
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error("Error deleting assessment:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}

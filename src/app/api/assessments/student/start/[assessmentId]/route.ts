import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest, verifyToken } from "@/lib/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

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

		const { db } = await connectToDatabase();

		// Get student details - use same logic as assigned route
		let student = await db.collection("students").findOne({
			userId: new ObjectId(decoded.userId),
		});

		// If not found by userId, try finding by email
		if (!student) {
			student = await db.collection("students").findOne({
				email: decoded.email,
			});
		}

		// If still not found, check if the user is a student role in users collection
		if (!student) {
			const user = await db.collection("users").findOne({
				_id: new ObjectId(decoded.userId),
				role: "STUDENT",
			});

			if (user) {
				// Create a virtual student record from user data
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

		// Check if assessment is active
		if (assessment.status !== "active") {
			return NextResponse.json(
				{ success: false, error: "Assessment is not available" },
				{ status: 400 }
			);
		}

		// Check if student is eligible for this assessment
		const isEligible =
			!assessment.criteria?.course ||
			assessment.criteria.course.length === 0 ||
			assessment.criteria.course.includes(student.course);

		if (!isEligible) {
			return NextResponse.json(
				{ success: false, error: "You are not eligible for this assessment" },
				{ status: 403 }
			);
		}

		// Check existing responses to determine if student can start/continue
		const existingResponse = await db
			.collection("assessment_responses")
			.findOne({
				assessmentId: new ObjectId(assessmentId),
				studentId: new ObjectId(student._id),
			});

		interface ResponseRecord {
			_id?: ObjectId;
			assessmentId: ObjectId;
			studentId: ObjectId;
			studentEmail: string;
			studentName: string;
			attemptNumber: number;
			status: string;
			startedAt: Date;
			answers: Record<string, unknown>;
			createdAt: Date;
			updatedAt: Date;
		}

		let responseRecord: ResponseRecord;

		if (existingResponse) {
			// Check if assessment is already completed
			if (existingResponse.status === "completed") {
				// Check if multiple attempts are allowed
				if (
					!assessment.allowMultipleAttempts ||
					(existingResponse.attemptNumber || 1) >= (assessment.maxAttempts || 1)
				) {
					return NextResponse.json(
						{ success: false, error: "Assessment already completed" },
						{ status: 400 }
					);
				}

				// Create new attempt
				const newAttemptNumber = (existingResponse.attemptNumber || 1) + 1;
				const newResponse = {
					assessmentId: new ObjectId(assessmentId),
					studentId: new ObjectId(student._id),
					studentEmail: student.email,
					studentName: `${student.firstName} ${student.lastName}`,
					attemptNumber: newAttemptNumber,
					status: "in_progress",
					startedAt: new Date(),
					answers: {},
					createdAt: new Date(),
					updatedAt: new Date(),
				};

				const result = await db
					.collection("assessment_responses")
					.insertOne(newResponse);
				responseRecord = { ...newResponse, _id: result.insertedId };
			} else if (existingResponse.status === "in_progress") {
				// Continue existing attempt
				responseRecord = existingResponse as ResponseRecord;

				// Update the started time if it's been too long (session resumption)
				await db.collection("assessment_responses").updateOne(
					{ _id: existingResponse._id },
					{
						$set: {
							updatedAt: new Date(),
							// Reset startedAt if it's more than assessment time limit
							...(assessment.timeLimit &&
							existingResponse.startedAt &&
							Date.now() - new Date(existingResponse.startedAt).getTime() >
								assessment.timeLimit * 60 * 1000
								? { startedAt: new Date() }
								: {}),
						},
					}
				);
			} else {
				// Start new attempt for draft/not_started status
				responseRecord = existingResponse as ResponseRecord;
				await db.collection("assessment_responses").updateOne(
					{ _id: existingResponse._id },
					{
						$set: {
							status: "in_progress",
							startedAt: new Date(),
							updatedAt: new Date(),
						},
					}
				);
			}
		} else {
			// Create new response record
			const newResponse = {
				assessmentId: new ObjectId(assessmentId),
				studentId: new ObjectId(student._id),
				studentEmail: student.email,
				studentName: `${student.firstName} ${student.lastName}`,
				attemptNumber: 1,
				status: "in_progress",
				startedAt: new Date(),
				answers: {},
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			const result = await db
				.collection("assessment_responses")
				.insertOne(newResponse);
			responseRecord = { ...newResponse, _id: result.insertedId };
		}

		// Return assessment data for the student
		const assessmentData = {
			_id: assessment._id,
			title: assessment.title,
			description: assessment.description,
			instructions: assessment.instructions,
			timeLimit: assessment.timeLimit,
			sections: assessment.sections.map(
				(section: {
					_id?: ObjectId;
					title: string;
					description?: string;
					questions: Array<{
						_id?: ObjectId;
						prompt?: string;
						text?: string;
						required?: boolean;
						scale?: {
							min?: number;
							max?: number;
							minLabel?: string;
							maxLabel?: string;
							labels?: string[];
						};
					}>;
				}) => ({
					_id: section._id || new ObjectId(),
					title: section.title,
					description: section.description || "",
					questions: section.questions.map(
						(question: {
							_id?: ObjectId;
							prompt?: string;
							text?: string;
							required?: boolean;
							scale?: {
								min?: number;
								max?: number;
								minLabel?: string;
								maxLabel?: string;
								labels?: string[];
							};
						}) => {
							const min = question.scale?.min || 1;
							const max = question.scale?.max || 5;
							const minLabel = question.scale?.minLabel || "Poor";
							const maxLabel = question.scale?.maxLabel || "Excellent";

							// Generate labels array if not provided
							let labels = question.scale?.labels || [];
							if (labels.length === 0) {
								// Create labels based on scale range
								const range = max - min + 1;
								if (range === 5) {
									labels = ["Very Poor", "Poor", "Fair", "Good", "Excellent"];
								} else if (range === 4) {
									labels = ["Poor", "Fair", "Good", "Excellent"];
								} else if (range === 3) {
									labels = ["Low", "Medium", "High"];
								} else {
									// Generate generic labels for other ranges
									labels = Array.from({ length: range }, (_, i) => {
										if (i === 0) return minLabel;
										if (i === range - 1) return maxLabel;
										return `Level ${i + 1}`;
									});
								}
							}

							return {
								_id: question._id || new ObjectId(),
								text: question.prompt || question.text || "",
								isRequired: question.required !== false,
								scaleOptions: {
									min,
									max,
									minLabel,
									maxLabel,
									labels,
								},
							};
						}
					),
				})
			),
		};

		return NextResponse.json({
			success: true,
			assessment: assessmentData,
			responseId: responseRecord._id,
			attemptNumber: responseRecord.attemptNumber,
			message:
				existingResponse?.status === "in_progress"
					? "Resuming assessment"
					: "Assessment started successfully",
		});
	} catch (error) {
		console.error("Error starting assessment:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}

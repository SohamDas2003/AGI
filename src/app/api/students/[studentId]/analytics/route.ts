import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getTokenFromRequest, verifyToken } from "@/lib/jwt";
import { ObjectId } from "mongodb";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ studentId: string }> }
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

		const { studentId } = await params;

		if (!ObjectId.isValid(studentId)) {
			return NextResponse.json(
				{ success: false, error: "Invalid student ID" },
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

		// Get all completed responses for this student
		const responses = await db
			.collection("assessment_responses")
			.find({
				studentId: new ObjectId(studentId),
				status: "completed",
			})
			.toArray();

		if (responses.length === 0) {
			return NextResponse.json({
				success: true,
				student: {
					_id: student._id,
					name: `${student.firstName} ${student.lastName}`,
					email: student.email,
					course: student.course,
					batchName: student.batchName,
				},
				analytics: {
					totalAssessments: 0,
					overallAveragePercentage: 0,
					overallAverageRating: 0,
					assessments: [],
					sectionPerformance: {},
					areasNeedingAttention: [],
				},
			});
		}

		// Get assessment details for all responses
		const assessmentIds = responses.map((r) => new ObjectId(r.assessmentId));
		const assessments = await db
			.collection("assessments")
			.find({ _id: { $in: assessmentIds } })
			.toArray();

		const assessmentMap = new Map(
			assessments.map((a) => [a._id.toString(), a])
		);

		// Calculate overall statistics
		const totalAssessments = responses.length;
		const overallAveragePercentage =
			responses.reduce((sum, r) => sum + (r.overallPercentage || 0), 0) /
			totalAssessments;
		const overallAverageRating =
			responses.reduce((sum, r) => sum + (r.overallAverageRating || 0), 0) /
			totalAssessments;

		// Aggregate section performance across all assessments
		const sectionPerformanceMap = new Map<
			string,
			{
				sectionTitle: string;
				attempts: number;
				totalPercentage: number;
				totalRating: number;
			}
		>();

		responses.forEach((response) => {
			if (response.sectionScores) {
				response.sectionScores.forEach(
					(ss: {
						sectionTitle: string;
						percentage: number;
						averageRating: number;
					}) => {
						const key = ss.sectionTitle;
						const existing = sectionPerformanceMap.get(key);
						if (existing) {
							existing.attempts++;
							existing.totalPercentage += ss.percentage;
							existing.totalRating += ss.averageRating;
						} else {
							sectionPerformanceMap.set(key, {
								sectionTitle: ss.sectionTitle,
								attempts: 1,
								totalPercentage: ss.percentage,
								totalRating: ss.averageRating,
							});
						}
					}
				);
			}
		});

		// Calculate average performance per section
		const sectionPerformance = Array.from(sectionPerformanceMap.values()).map(
			(sp) => ({
				sectionTitle: sp.sectionTitle,
				attempts: sp.attempts,
				averagePercentage:
					Math.round((sp.totalPercentage / sp.attempts) * 10) / 10,
				averageRating: Math.round((sp.totalRating / sp.attempts) * 10) / 10,
				needsAttention: sp.totalPercentage / sp.attempts < 60,
			})
		);

		// Identify areas needing attention
		const areasNeedingAttention = sectionPerformance
			.filter((sp) => sp.needsAttention)
			.sort((a, b) => a.averagePercentage - b.averagePercentage);

		// Build assessment performance list
		const assessmentPerformance = responses.map((response) => {
			const assessment = assessmentMap.get(response.assessmentId.toString());
			return {
				assessmentId: response.assessmentId,
				assessmentTitle: assessment?.title || "Unknown Assessment",
				overallPercentage: response.overallPercentage || 0,
				overallAverageRating: response.overallAverageRating || 0,
				completedAt: response.completedAt,
				timeSpent: response.timeSpent || 0,
				sectionScores: response.sectionScores || [],
			};
		});

		return NextResponse.json({
			success: true,
			student: {
				_id: student._id,
				name: `${student.firstName} ${student.lastName}`,
				email: student.email,
				course: student.course,
				batchName: student.batchName,
			},
			analytics: {
				totalAssessments,
				overallAveragePercentage:
					Math.round(overallAveragePercentage * 10) / 10,
				overallAverageRating: Math.round(overallAverageRating * 10) / 10,
				assessments: assessmentPerformance,
				sectionPerformance,
				areasNeedingAttention,
			},
		});
	} catch (error) {
		console.error("Error fetching student overall analytics:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}

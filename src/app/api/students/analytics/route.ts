import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getTokenFromRequest, verifyToken } from "@/lib/jwt-edge";

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

		// Get all students
		const students = await db.collection("students").find({}).toArray();

		// Get all completed responses
		const responses = await db
			.collection("assessment_responses")
			.find({ status: "completed" })
			.toArray();

		// Aggregate analytics per student
		const studentAnalytics = students.map((student) => {
			const studentResponses = responses.filter(
				(r) => r.studentId.toString() === student._id.toString()
			);

			const completedAssessments = studentResponses.length;

			if (completedAssessments === 0) {
				return {
					_id: student._id,
					name: `${student.firstName} ${student.lastName}`,
					email: student.email,
					course: student.course || "N/A",
					batchName: student.batchName || "N/A",
					status: "No assessments completed",
					overallPercentage: null,
					overallAverageRating: null,
					completedAssessments: 0,
					sectionsNeedingAttention: [],
					needsAttention: false,
				};
			}

			const avgPercentage =
				studentResponses.reduce(
					(sum, r) => sum + (r.overallPercentage || 0),
					0
				) / completedAssessments;

			const avgRating =
				studentResponses.reduce(
					(sum, r) => sum + (r.overallAverageRating || 0),
					0
				) / completedAssessments;

			// Collect all section titles where student needs attention
			const sectionsNeedingAttention = new Set<string>();
			studentResponses.forEach((response) => {
				if (response.sectionScores) {
					response.sectionScores.forEach(
						(ss: { sectionTitle: string; percentage: number }) => {
							if (ss.percentage < 60) {
								sectionsNeedingAttention.add(ss.sectionTitle);
							}
						}
					);
				}
			});

			return {
				_id: student._id,
				name: `${student.firstName} ${student.lastName}`,
				email: student.email,
				course: student.course || "N/A",
				batchName: student.batchName || "N/A",
				status: "Active",
				overallPercentage: Math.round(avgPercentage * 10) / 10,
				overallAverageRating: Math.round(avgRating * 10) / 10,
				completedAssessments,
				sectionsNeedingAttention: Array.from(sectionsNeedingAttention),
				needsAttention: avgPercentage < 60,
			};
		});

		// Sort by those needing attention first, then by percentage
		studentAnalytics.sort((a, b) => {
			if (a.needsAttention && !b.needsAttention) return -1;
			if (!a.needsAttention && b.needsAttention) return 1;
			return (a.overallPercentage || 0) - (b.overallPercentage || 0);
		});

		return NextResponse.json({
			success: true,
			students: studentAnalytics,
			summary: {
				totalStudents: students.length,
				studentsWithCompletedAssessments: studentAnalytics.filter(
					(s) => s.completedAssessments > 0
				).length,
				studentsNeedingAttention: studentAnalytics.filter(
					(s) => s.needsAttention
				).length,
				averagePerformance:
					Math.round(
						(studentAnalytics.reduce(
							(sum, s) => sum + (s.overallPercentage || 0),
							0
						) /
							studentAnalytics.filter((s) => s.overallPercentage !== null)
								.length) *
							10
					) / 10,
			},
		});
	} catch (error) {
		console.error("Error fetching students analytics:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}

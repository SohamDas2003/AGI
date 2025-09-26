import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
	try {
		const { db } = await connectToDatabase();

		// Get all assessments
		const assessments = await db.collection("assessments").find({}).toArray();

		// Get all students
		const students = await db.collection("students").find({}).toArray();

		// Get all assessment responses
		const responses = await db
			.collection("assessment_responses")
			.find({})
			.toArray();

		return NextResponse.json({
			success: true,
			debug: {
				assessmentsCount: assessments.length,
				studentsCount: students.length,
				responsesCount: responses.length,
				assessments: assessments.map((a) => ({
					_id: a._id,
					title: a.title,
					status: a.status,
					criteria: a.criteria,
					createdAt: a.createdAt,
				})),
				students: students.slice(0, 3).map((s) => ({
					_id: s._id,
					studentName: s.studentName,
					course: s.course,
					batchName: s.batchName,
					site: s.site,
				})),
			},
		});
	} catch (error) {
		console.error("Debug error:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}

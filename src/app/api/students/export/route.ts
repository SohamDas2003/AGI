import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Student } from "@/models/User";

export async function GET(request: NextRequest) {
	try {
		// Connect to database
		const { db } = await connectToDatabase();
		const studentsCollection = db.collection<Student>("students");

		// Get query parameters
		const { searchParams } = new URL(request.url);
		const search = searchParams.get("search") || "";
		const site = searchParams.get("site") || "";
		const batchName = searchParams.get("batchName") || "";
		const academicSession = searchParams.get("academicSession") || "";
		const studentClass = searchParams.get("class") || "";
		const course = searchParams.get("course") || "";
		const studentStatus = searchParams.get("studentStatus") || "";

		// Build filter
		const filter: Record<string, unknown> = {};

		// Text search across multiple fields
		if (search) {
			filter.$or = [
				{ studentName: { $regex: search, $options: "i" } },
				{ registrationNo: { $regex: search, $options: "i" } },
				{ rollNo: { $regex: search, $options: "i" } },
				{ email: { $regex: search, $options: "i" } },
			];
		}

		// Filter by specific fields
		if (site) filter.site = site;
		if (batchName) filter.batchName = batchName;
		if (academicSession) filter.academicSession = academicSession;
		if (studentClass) filter.class = studentClass;
		if (course) filter.course = course;
		if (studentStatus) filter.studentStatus = studentStatus;

		// Get all matching students (no pagination for export)
		const students = await studentsCollection
			.find(filter)
			.sort({ studentName: 1 })
			.toArray();

		// Create CSV content
		const headers = [
			"Student Name",
			"Registration No",
			"Roll No",
			"Email",
			"Site",
			"Course",
			"Batch Name",
			"Academic Session",
			"Class",
			"Student Status",
			"Created Date",
		];

		const csvRows = [
			headers.join(","),
			...students.map((student) =>
				[
					`"${student.studentName || ""}"`,
					`"${student.registrationNo || ""}"`,
					`"${student.rollNo || ""}"`,
					`"${student.email || ""}"`,
					`"${student.site || ""}"`,
					`"${student.course || ""}"`,
					`"${student.batchName || ""}"`,
					`"${student.academicSession || ""}"`,
					`"${student.class || ""}"`,
					`"${student.studentStatus || ""}"`,
					`"${
						student.createdAt
							? new Date(student.createdAt).toLocaleDateString()
							: ""
					}"`,
				].join(",")
			),
		];

		const csvContent = csvRows.join("\n");

		// Return CSV file
		return new NextResponse(csvContent, {
			headers: {
				"Content-Type": "text/csv",
				"Content-Disposition": `attachment; filename="students-export-${new Date()
					.toISOString()
					.slice(0, 10)}.csv"`,
			},
		});
	} catch (error) {
		console.error("Error exporting students:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

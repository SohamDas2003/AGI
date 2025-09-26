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
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "20");
		const search = searchParams.get("search") || "";
		const site = searchParams.get("site") || "";
		const batchName = searchParams.get("batchName") || "";
		const academicSession = searchParams.get("academicSession") || "";
		const studentClass = searchParams.get("class") || "";
		const course = searchParams.get("course") || "";
		const studentStatus = searchParams.get("studentStatus") || "";
		const sortBy = searchParams.get("sortBy") || "createdAt";
		const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

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

		// Get total count
		const total = await studentsCollection.countDocuments(filter);

		// Get students with pagination and sorting
		let query = studentsCollection.find(filter);

		// Apply sorting
		if (sortBy === "studentName") {
			query = query.sort({ studentName: sortOrder });
		} else if (sortBy === "registrationNo") {
			query = query.sort({ registrationNo: sortOrder });
		} else if (sortBy === "rollNo") {
			query = query.sort({ rollNo: sortOrder });
		} else if (sortBy === "course") {
			query = query.sort({ course: sortOrder });
		} else if (sortBy === "batchName") {
			query = query.sort({ batchName: sortOrder });
		} else if (sortBy === "studentStatus") {
			query = query.sort({ studentStatus: sortOrder });
		} else {
			query = query.sort({ createdAt: sortOrder });
		}

		const students = await query
			.skip((page - 1) * limit)
			.limit(limit)
			.toArray();

		// Get unique values for filters
		const uniqueValues = await studentsCollection
			.aggregate([
				{
					$group: {
						_id: null,
						sites: { $addToSet: "$site" },
						batchNames: { $addToSet: "$batchName" },
						academicSessions: { $addToSet: "$academicSession" },
						classes: { $addToSet: "$class" },
						courses: { $addToSet: "$course" },
						studentStatuses: { $addToSet: "$studentStatus" },
					},
				},
			])
			.toArray();

		const filterOptions = uniqueValues[0] || {
			sites: [],
			batchNames: [],
			academicSessions: [],
			classes: [],
			courses: [],
			studentStatuses: [],
		};

		return NextResponse.json({
			success: true,
			students: students.map((student) => ({
				_id: student._id,
				studentName: student.studentName,
				registrationNo: student.registrationNo,
				rollNo: student.rollNo,
				email: student.email,
				site: student.site,
				batchName: student.batchName,
				academicSession: student.academicSession,
				class: student.class,
				course: student.course,
				studentStatus: student.studentStatus,
				createdAt: student.createdAt,
				updatedAt: student.updatedAt,
			})),
			pagination: {
				currentPage: page,
				totalPages: Math.ceil(total / limit),
				totalStudents: total,
				hasNextPage: page < Math.ceil(total / limit),
				hasPrevPage: page > 1,
			},
			filterOptions,
		});
	} catch (error) {
		console.error("Error fetching students:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET(request: NextRequest) {
	try {
		// Connect to database
		const { db } = await connectToDatabase();
		const usersCollection = db.collection<User>("users");

		// Get query parameters
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "10");
		const course = searchParams.get("course");
		const division = searchParams.get("division");

		// Build filter
		const filter: Record<string, unknown> = { role: "student" };
		if (course) filter.course = course;
		if (division) filter.division = division;

		// Get total count
		const total = await usersCollection.countDocuments(filter);

		// Get students with pagination
		const students = await usersCollection
			.find(filter)
			.skip((page - 1) * limit)
			.limit(limit)
			.sort({ createdAt: -1 })
			.toArray();

		// Remove sensitive data
		const sanitizedStudents = students.map((student) => ({
			_id: student._id,
			email: student.email,
			name: student.name,
			studentId: student.studentId,
			rollNumber: student.rollNumber,
			firstName: student.firstName,
			lastName: student.lastName,
			course: student.course,
			division: student.division,
			phone: student.phone,
			gender: student.gender,
			yearOfStudy: student.yearOfStudy,
			createdAt: student.createdAt,
		}));

		return NextResponse.json({
			success: true,
			students: sanitizedStudents,
			pagination: {
				currentPage: page,
				totalPages: Math.ceil(total / limit),
				totalStudents: total,
				hasNextPage: page < Math.ceil(total / limit),
				hasPrevPage: page > 1,
			},
		});
	} catch (error) {
		console.error("Error fetching students:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

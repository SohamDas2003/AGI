import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth";
import { User, Student } from "@/models/User";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const {
			studentName,
			registrationNo,
			rollNo,
			site,
			batchName,
			academicSession,
			class: studentClass,
			studentStatus,
			email,
			password,
		} = body;

		// Validate required fields
		if (
			!studentName ||
			!registrationNo ||
			!rollNo ||
			!site ||
			!batchName ||
			!academicSession ||
			!studentClass ||
			!studentStatus ||
			!email ||
			!password
		) {
			return NextResponse.json(
				{
					success: false,
					message: "All fields are required",
				},
				{ status: 400 }
			);
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{
					success: false,
					message: "Invalid email format",
				},
				{ status: 400 }
			);
		}

		// Validate student status
		if (!["Active", "Inactive"].includes(studentStatus)) {
			return NextResponse.json(
				{
					success: false,
					message: "Student status must be 'Active' or 'Inactive'",
				},
				{ status: 400 }
			);
		}

		const { db } = await connectToDatabase();

		// Check if user with this email already exists
		const existingUser = await db
			.collection<User>("users")
			.findOne({ email: email.toLowerCase() });

		if (existingUser) {
			return NextResponse.json(
				{
					success: false,
					message: "User with this email already exists",
				},
				{ status: 409 }
			);
		}

		// Check if student with this registration number already exists
		const existingStudent = await db
			.collection<Student>("students")
			.findOne({ registrationNo });

		if (existingStudent) {
			return NextResponse.json(
				{
					success: false,
					message: "Student with this registration number already exists",
				},
				{ status: 409 }
			);
		}

		// Create user data for the student
		const userData: User = {
			email: email.toLowerCase(),
			password: await hashPassword(password),
			role: "STUDENT",
			firstName: studentName.split(" ")[0] || studentName,
			lastName: studentName.split(" ").slice(1).join(" ") || "",
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		// Insert the user first
		const userResult = await db.collection<User>("users").insertOne(userData);

		if (!userResult.insertedId) {
			throw new Error("Failed to create user account");
		}

		// Create student data
		const studentData: Student = {
			userId: userResult.insertedId,
			studentName,
			registrationNo,
			rollNo,
			site,
			batchName,
			academicSession,
			class: studentClass,
			studentStatus: studentStatus as "Active" | "Inactive",
			email: email.toLowerCase(),
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		// Insert the student
		const studentResult = await db
			.collection<Student>("students")
			.insertOne(studentData);

		if (studentResult.insertedId) {
			return NextResponse.json(
				{
					success: true,
					message: "Student created successfully",
					student: {
						id: studentResult.insertedId,
						userId: userResult.insertedId,
						studentName,
						registrationNo,
						rollNo,
						site,
						batchName,
						academicSession,
						class: studentClass,
						studentStatus,
						email: email.toLowerCase(),
						createdAt: studentData.createdAt,
					},
				},
				{ status: 201 }
			);
		} else {
			// If student creation fails, we should ideally rollback the user creation
			// For now, we'll just report the error
			throw new Error("Failed to create student record");
		}
	} catch (error: unknown) {
		console.error("Error creating student:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to create student",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

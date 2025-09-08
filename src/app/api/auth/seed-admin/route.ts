import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth";
import { User } from "@/models/User";

export async function POST() {
	try {
		const { db } = await connectToDatabase();
		const usersCollection = db.collection<User>("users");

		// Check if admin already exists
		const existingAdmin = await usersCollection.findOne({
			email: "admin@agi.com",
			role: "admin",
		});

		if (existingAdmin) {
			return NextResponse.json(
				{
					success: false,
					message: "Admin user already exists",
				},
				{ status: 400 }
			);
		}

		// Create admin user
		const hashedAdminPassword = await hashPassword("admin@123");
		const adminUser: User = {
			email: "admin@agi.com",
			password: hashedAdminPassword,
			role: "admin",
			name: "Admin User",
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const adminResult = await usersCollection.insertOne(adminUser);

		// Also create a sample student user
		const hashedStudentPassword = await hashPassword("student123");
		const studentUser: User = {
			email: "student@agi.com",
			password: hashedStudentPassword,
			role: "student",
			name: "John Smith",
			studentId: "MCA2024001",
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const studentResult = await usersCollection.insertOne(studentUser);

		return NextResponse.json({
			success: true,
			message: "Admin and sample student users created successfully",
			adminUserId: adminResult.insertedId,
			studentUserId: studentResult.insertedId,
		});
	} catch (error) {
		console.error("Error creating admin user:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to create admin user",
			},
			{ status: 500 }
		);
	}
}

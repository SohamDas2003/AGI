import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth";
import { User } from "@/models/User";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { email, password, firstName, lastName } = body;

		// Validate required fields
		if (!email || !password || !firstName || !lastName) {
			return NextResponse.json(
				{
					success: false,
					message:
						"All fields are required (email, password, firstName, lastName)",
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

		// Validate password strength
		if (password.length < 8) {
			return NextResponse.json(
				{
					success: false,
					message: "Password must be at least 8 characters long",
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

		// Create admin user data
		const adminData: User = {
			email: email.toLowerCase(),
			password: await hashPassword(password),
			role: "ADMIN",
			firstName: firstName.trim(),
			lastName: lastName.trim(),
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		// Insert the admin user
		const result = await db.collection<User>("users").insertOne(adminData);

		if (result.insertedId) {
			return NextResponse.json(
				{
					success: true,
					message: "Admin created successfully",
					admin: {
						id: result.insertedId,
						email: adminData.email,
						firstName: adminData.firstName,
						lastName: adminData.lastName,
						role: adminData.role,
						createdAt: adminData.createdAt,
					},
				},
				{ status: 201 }
			);
		} else {
			throw new Error("Failed to create admin");
		}
	} catch (error: unknown) {
		console.error("Error creating admin:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to create admin",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

export async function GET() {
	try {
		const { db } = await connectToDatabase();

		// Get all admin users
		const admins = await db
			.collection<User>("users")
			.find(
				{ role: "ADMIN" },
				{ projection: { password: 0 } } // Exclude password from response
			)
			.sort({ createdAt: -1 })
			.toArray();

		return NextResponse.json(
			{
				success: true,
				message: "Admins retrieved successfully",
				admins: admins.map((admin) => ({
					id: admin._id,
					email: admin.email,
					firstName: admin.firstName,
					lastName: admin.lastName,
					role: admin.role,
					createdAt: admin.createdAt,
					updatedAt: admin.updatedAt,
				})),
				count: admins.length,
			},
			{ status: 200 }
		);
	} catch (error: unknown) {
		console.error("Error retrieving admins:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to retrieve admins",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

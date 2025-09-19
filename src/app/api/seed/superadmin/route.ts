import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth";
import { User } from "@/models/User";

export async function POST() {
	try {
		const { db } = await connectToDatabase();

		// Check if superadmin already exists
		const existingSuperAdmin = await db
			.collection<User>("users")
			.findOne({ role: "SUPERADMIN" });

		if (existingSuperAdmin) {
			return NextResponse.json(
				{
					success: false,
					message: "Super Administrator already exists",
					email: existingSuperAdmin.email,
				},
				{ status: 409 }
			);
		}

		// Default superadmin credentials
		const superAdminData = {
			email: "superadmin@aimsr.edu",
			password: await hashPassword("SuperAdmin@123"),
			role: "SUPERADMIN" as const,
			firstName: "Super",
			lastName: "Administrator",
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		// Create the super administrator
		const result = await db.collection<User>("users").insertOne(superAdminData);

		if (result.insertedId) {
			return NextResponse.json(
				{
					success: true,
					message: "Super Administrator created successfully",
					superAdmin: {
						id: result.insertedId,
						email: superAdminData.email,
						firstName: superAdminData.firstName,
						lastName: superAdminData.lastName,
						role: superAdminData.role,
					},
				},
				{ status: 201 }
			);
		} else {
			throw new Error("Failed to create Super Administrator");
		}
	} catch (error: unknown) {
		console.error("Error creating Super Administrator:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error occurred";
		return NextResponse.json(
			{
				success: false,
				message: "Failed to create Super Administrator",
				error: errorMessage,
			},
			{ status: 500 }
		);
	}
}

export async function GET() {
	try {
		const { db } = await connectToDatabase();

		// Check if superadmin exists
		const superAdmin = await db.collection<User>("users").findOne(
			{ role: "SUPERADMIN" },
			{ projection: { password: 0 } } // Exclude password from response
		);

		if (superAdmin) {
			return NextResponse.json(
				{
					success: true,
					message: "Super Administrator found",
					superAdmin: {
						id: superAdmin._id,
						email: superAdmin.email,
						firstName: superAdmin.firstName,
						lastName: superAdmin.lastName,
						role: superAdmin.role,
						createdAt: superAdmin.createdAt,
					},
				},
				{ status: 200 }
			);
		} else {
			return NextResponse.json(
				{
					success: false,
					message: "No Super Administrator found",
				},
				{ status: 404 }
			);
		}
	} catch (error: unknown) {
		console.error("Error checking Super Administrator:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error occurred";
		return NextResponse.json(
			{
				success: false,
				message: "Failed to check Super Administrator",
				error: errorMessage,
			},
			{ status: 500 }
		);
	}
}

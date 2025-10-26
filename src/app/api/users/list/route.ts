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
		const limit = parseInt(searchParams.get("limit") || "20");
		const search = searchParams.get("search") || "";
		const role = searchParams.get("role") || "";
		const sortBy = searchParams.get("sortBy") || "createdAt";
		const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

		// Build filter
		const filter: Record<string, unknown> = {};

		if (search) {
			filter.$or = [
				{ name: { $regex: search, $options: "i" } },
				{ email: { $regex: search, $options: "i" } },
			];
		}

		if (role) {
			filter.role = role;
		}

		// Get total count
		const total = await usersCollection.countDocuments(filter);

		// Get users with pagination and sorting
		const users = await usersCollection
			.find(filter)
			.sort({ [sortBy]: sortOrder })
			.skip((page - 1) * limit)
			.limit(limit)
			.toArray();

		// Remove password from the result
		const usersWithoutPassword = users.map((user) => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { password, ...userWithoutPassword } = user;
			return userWithoutPassword;
		});

		return NextResponse.json({
			success: true,
			users: usersWithoutPassword,
			pagination: {
				currentPage: page,
				totalPages: Math.ceil(total / limit),
				totalUsers: total,
				hasNextPage: page < Math.ceil(total / limit),
				hasPrevPage: page > 1,
			},
		});
	} catch (error) {
		console.error("Error fetching users:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
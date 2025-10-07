import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt-edge";
import { User } from "@/models/User";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
	try {
		// Log for debugging
		console.log("🔍 Auth check:", {
			host: request.headers.get("host"),
			cookies: request.headers.get("cookie"),
			hasAuthToken: !!request.cookies.get("auth-token")?.value,
		});

		// Get token from cookie
		const token = request.cookies.get("auth-token")?.value;

		if (!token) {
			return NextResponse.json(
				{
					success: false,
					message: "Not authenticated",
				},
				{ status: 401 }
			);
		}

		// Verify token (now async)
		const payload = await verifyToken(token);
		if (!payload) {
			return NextResponse.json(
				{
					success: false,
					message: "Invalid token",
				},
				{ status: 401 }
			);
		}

		// Connect to database
		const { db } = await connectToDatabase();
		const usersCollection = db.collection<User>("users");

		// Find user
		const user = await usersCollection.findOne({
			_id: new ObjectId(payload.userId),
		});

		if (!user) {
			return NextResponse.json(
				{
					success: false,
					message: "User not found",
				},
				{ status: 404 }
			);
		}

		// Return user info (without password)
		return NextResponse.json({
			success: true,
			user: {
				email: user.email,
				role: user.role,
				firstName: user.firstName,
				lastName: user.lastName,
			},
		});
	} catch (error) {
		console.error("Get user error:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Internal server error",
			},
			{ status: 500 }
		);
	}
}

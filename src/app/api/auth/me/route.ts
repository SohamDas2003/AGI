import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import { User } from "@/models/User";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
	try {
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

		// Verify token
		const payload = verifyToken(token);
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
				name: user.name,
				studentId: user.studentId,
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

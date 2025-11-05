import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { hashPassword, comparePassword } from "@/lib/auth";
import { sendPasswordChangedEmail } from "@/lib/email";
import { User } from "@/models/User";
import { verifyToken } from "@/lib/jwt-edge";

export async function POST(request: NextRequest) {
	try {
		// Get token from cookie
		const token = request.cookies.get("auth-token")?.value;

		if (!token) {
			return NextResponse.json(
				{
					success: false,
					message: "Unauthorized - No token provided",
				},
				{ status: 401 }
			);
		}

		// Verify token
		let decoded;
		try {
			decoded = await verifyToken(token);
			if (!decoded) {
				return NextResponse.json(
					{
						success: false,
						message: "Unauthorized - Invalid token",
					},
					{ status: 401 }
				);
			}
		} catch (error) {
			console.error("Token verification error:", error);
			return NextResponse.json(
				{
					success: false,
					message: "Unauthorized - Invalid token",
				},
				{ status: 401 }
			);
		}

		const body = await request.json();
		const { currentPassword, newPassword } = body;

		// Validate input
		if (!currentPassword || !newPassword) {
			return NextResponse.json(
				{
					success: false,
					message: "Current password and new password are required",
				},
				{ status: 400 }
			);
		}

		// Validate password strength
		if (newPassword.length < 8) {
			return NextResponse.json(
				{
					success: false,
					message: "New password must be at least 8 characters long",
				},
				{ status: 400 }
			);
		}

		// Connect to database
		const { db } = await connectToDatabase();
		const usersCollection = db.collection<User>("users");

		// Find user by ID from token
		const user = await usersCollection.findOne({
			email: decoded.email,
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

		// Verify current password
		const isCurrentPasswordValid = await comparePassword(
			currentPassword,
			user.password
		);

		if (!isCurrentPasswordValid) {
			return NextResponse.json(
				{
					success: false,
					message: "Current password is incorrect",
				},
				{ status: 400 }
			);
		}

		// Check if new password is different from current
		const isSamePassword = await comparePassword(newPassword, user.password);
		if (isSamePassword) {
			return NextResponse.json(
				{
					success: false,
					message: "New password must be different from current password",
				},
				{ status: 400 }
			);
		}

		// Hash the new password
		const hashedPassword = await hashPassword(newPassword);

		// Update user's password
		await usersCollection.updateOne(
			{ _id: user._id },
			{
				$set: {
					password: hashedPassword,
					updatedAt: new Date(),
				},
			}
		);

		// Send confirmation email
		await sendPasswordChangedEmail(user.email, user.firstName);

		console.log(`Password changed successfully for user: ${user.email}`);

		return NextResponse.json({
			success: true,
			message: "Password has been changed successfully",
		});
	} catch (error) {
		console.error("Change password error:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Internal server error. Please try again later.",
			},
			{ status: 500 }
		);
	}
}

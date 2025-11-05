import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth";
import { sendPasswordChangedEmail } from "@/lib/email";
import { User } from "@/models/User";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { token, newPassword } = body;

		// Validate input
		if (!token || !newPassword) {
			return NextResponse.json(
				{
					success: false,
					message: "Token and new password are required",
				},
				{ status: 400 }
			);
		}

		// Validate password strength
		if (newPassword.length < 8) {
			return NextResponse.json(
				{
					success: false,
					message: "Password must be at least 8 characters long",
				},
				{ status: 400 }
			);
		}

		// Connect to database
		const { db } = await connectToDatabase();
		const usersCollection = db.collection<User>("users");

		// Find user with valid reset token
		const user = await usersCollection.findOne({
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: new Date() }, // Token must not be expired
		});

		if (!user) {
			return NextResponse.json(
				{
					success: false,
					message:
						"Invalid or expired reset token. Please request a new password reset.",
				},
				{ status: 400 }
			);
		}

		// Hash the new password
		const hashedPassword = await hashPassword(newPassword);

		// Update user's password and remove reset token
		await usersCollection.updateOne(
			{ _id: user._id },
			{
				$set: {
					password: hashedPassword,
					updatedAt: new Date(),
				},
				$unset: {
					resetPasswordToken: "",
					resetPasswordExpires: "",
				},
			}
		);

		// Send confirmation email
		await sendPasswordChangedEmail(user.email, user.firstName);

		console.log(`Password reset successful for user: ${user.email}`);

		return NextResponse.json({
			success: true,
			message:
				"Password has been reset successfully. You can now login with your new password.",
		});
	} catch (error) {
		console.error("Reset password error:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Internal server error. Please try again later.",
			},
			{ status: 500 }
		);
	}
}

// Optional: GET endpoint to verify if a token is valid
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const token = searchParams.get("token");

		if (!token) {
			return NextResponse.json(
				{
					success: false,
					message: "Token is required",
				},
				{ status: 400 }
			);
		}

		// Connect to database
		const { db } = await connectToDatabase();
		const usersCollection = db.collection<User>("users");

		// Find user with valid reset token
		const user = await usersCollection.findOne({
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: new Date() },
		});

		if (!user) {
			return NextResponse.json({
				success: false,
				valid: false,
				message: "Invalid or expired reset token",
			});
		}

		return NextResponse.json({
			success: true,
			valid: true,
			message: "Token is valid",
		});
	} catch (error) {
		console.error("Token verification error:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Internal server error",
			},
			{ status: 500 }
		);
	}
}

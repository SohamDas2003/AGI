import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { generateResetToken, sendPasswordResetEmail } from "@/lib/email";
import { User } from "@/models/User";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { email } = body;

		// Validate input
		if (!email) {
			return NextResponse.json(
				{
					success: false,
					message: "Email is required",
				},
				{ status: 400 }
			);
		}

		// Connect to database
		const { db } = await connectToDatabase();
		const usersCollection = db.collection<User>("users");

		// Find user by email
		const user = await usersCollection.findOne({
			email: email.toLowerCase(),
		});

		// For security reasons, always return success even if user doesn't exist
		// This prevents email enumeration attacks
		if (!user) {
			console.log(`Password reset requested for non-existent email: ${email}`);
			return NextResponse.json({
				success: true,
				message:
					"If an account exists with this email, a password reset link has been sent.",
			});
		}

		// Only allow students to reset password through this endpoint
		// (or you can allow all roles, depending on your requirement)
		if (user.role !== "STUDENT") {
			console.log(`Password reset attempted for non-student account: ${email}`);
			// Still return success to prevent role enumeration
			return NextResponse.json({
				success: true,
				message:
					"If an account exists with this email, a password reset link has been sent.",
			});
		}

		// Generate reset token
		const resetToken = generateResetToken();
		const resetTokenExpiry = new Date();
		resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token expires in 1 hour

		// Update user with reset token
		await usersCollection.updateOne(
			{ _id: user._id },
			{
				$set: {
					resetPasswordToken: resetToken,
					resetPasswordExpires: resetTokenExpiry,
					updatedAt: new Date(),
				},
			}
		);

		// Send password reset email
		const emailSent = await sendPasswordResetEmail(
			user.email,
			resetToken,
			user.firstName
		);

		if (!emailSent) {
			console.error(`Failed to send password reset email to: ${user.email}`);
			return NextResponse.json(
				{
					success: false,
					message:
						"Failed to send password reset email. Please try again later or contact support.",
				},
				{ status: 500 }
			);
		}

		console.log(`Password reset email sent successfully to: ${user.email}`);

		return NextResponse.json({
			success: true,
			message:
				"If an account exists with this email, a password reset link has been sent.",
		});
	} catch (error) {
		console.error("Forgot password error:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Internal server error. Please try again later.",
			},
			{ status: 500 }
		);
	}
}

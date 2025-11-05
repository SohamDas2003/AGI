import nodemailer from "nodemailer";
import crypto from "crypto";

// Create a transporter using environment variables
const createTransporter = () => {
	// Check if email configuration is available
	if (
		!process.env.EMAIL_HOST ||
		!process.env.EMAIL_USER ||
		!process.env.EMAIL_PASS
	) {
		console.warn(
			"Email configuration not found. Please set EMAIL_HOST, EMAIL_USER, and EMAIL_PASS environment variables."
		);
		return null;
	}

	return nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: parseInt(process.env.EMAIL_PORT || "587"),
		secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});
};

// Generate a secure random token
export const generateResetToken = (): string => {
	return crypto.randomBytes(32).toString("hex");
};

// Send password reset email
export const sendPasswordResetEmail = async (
	to: string,
	resetToken: string,
	firstName: string
): Promise<boolean> => {
	try {
		const transporter = createTransporter();

		if (!transporter) {
			console.error("Email transporter not configured");
			return false;
		}

		// Get the base URL from environment or use localhost as fallback
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
		const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

		const mailOptions = {
			from: `"${process.env.EMAIL_FROM_NAME || "AGI Platform"}" <${
				process.env.EMAIL_USER
			}>`,
			to,
			subject: "Password Reset Request",
			html: `
				<!DOCTYPE html>
				<html>
				<head>
					<style>
						body {
							font-family: Arial, sans-serif;
							line-height: 1.6;
							color: #333;
						}
						.container {
							max-width: 600px;
							margin: 0 auto;
							padding: 20px;
							background-color: #f9f9f9;
						}
						.content {
							background-color: white;
							padding: 30px;
							border-radius: 8px;
							box-shadow: 0 2px 4px rgba(0,0,0,0.1);
						}
						.button {
							display: inline-block;
							padding: 12px 24px;
							background-color: #007bff;
							color: white;
							text-decoration: none;
							border-radius: 5px;
							margin: 20px 0;
						}
						.footer {
							margin-top: 20px;
							padding-top: 20px;
							border-top: 1px solid #ddd;
							font-size: 12px;
							color: #666;
						}
					</style>
				</head>
				<body>
					<div class="container">
						<div class="content">
							<h2>Password Reset Request</h2>
							<p>Hello ${firstName},</p>
							<p>We received a request to reset your password. Click the button below to reset it:</p>
							<a href="${resetUrl}" class="button">Reset Password</a>
							<p>Or copy and paste this link into your browser:</p>
							<p style="word-break: break-all; color: #007bff;">${resetUrl}</p>
							<p><strong>This link will expire in 1 hour.</strong></p>
							<p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
							<div class="footer">
								<p>This is an automated email. Please do not reply.</p>
								<p>&copy; ${new Date().getFullYear()} AGI Platform. All rights reserved.</p>
							</div>
						</div>
					</div>
				</body>
				</html>
			`,
			text: `
				Hello ${firstName},
				
				We received a request to reset your password. Click the link below to reset it:
				
				${resetUrl}
				
				This link will expire in 1 hour.
				
				If you didn't request a password reset, please ignore this email or contact support if you have concerns.
				
				This is an automated email. Please do not reply.
			`,
		};

		await transporter.sendMail(mailOptions);
		console.log(`Password reset email sent to ${to}`);
		return true;
	} catch (error) {
		console.error("Error sending password reset email:", error);
		return false;
	}
};

// Send password changed confirmation email
export const sendPasswordChangedEmail = async (
	to: string,
	firstName: string
): Promise<boolean> => {
	try {
		const transporter = createTransporter();

		if (!transporter) {
			console.error("Email transporter not configured");
			return false;
		}

		const mailOptions = {
			from: `"${process.env.EMAIL_FROM_NAME || "AGI Platform"}" <${
				process.env.EMAIL_USER
			}>`,
			to,
			subject: "Password Changed Successfully",
			html: `
				<!DOCTYPE html>
				<html>
				<head>
					<style>
						body {
							font-family: Arial, sans-serif;
							line-height: 1.6;
							color: #333;
						}
						.container {
							max-width: 600px;
							margin: 0 auto;
							padding: 20px;
							background-color: #f9f9f9;
						}
						.content {
							background-color: white;
							padding: 30px;
							border-radius: 8px;
							box-shadow: 0 2px 4px rgba(0,0,0,0.1);
						}
						.footer {
							margin-top: 20px;
							padding-top: 20px;
							border-top: 1px solid #ddd;
							font-size: 12px;
							color: #666;
						}
						.alert {
							background-color: #d4edda;
							border: 1px solid #c3e6cb;
							color: #155724;
							padding: 12px;
							border-radius: 5px;
							margin: 20px 0;
						}
					</style>
				</head>
				<body>
					<div class="container">
						<div class="content">
							<h2>Password Changed Successfully</h2>
							<p>Hello ${firstName},</p>
							<div class="alert">
								<p><strong>Your password has been changed successfully.</strong></p>
							</div>
							<p>If you made this change, you can safely ignore this email.</p>
							<p>If you did not change your password, please contact support immediately and secure your account.</p>
							<div class="footer">
								<p>This is an automated email. Please do not reply.</p>
								<p>&copy; ${new Date().getFullYear()} AGI Platform. All rights reserved.</p>
							</div>
						</div>
					</div>
				</body>
				</html>
			`,
			text: `
				Hello ${firstName},
				
				Your password has been changed successfully.
				
				If you made this change, you can safely ignore this email.
				
				If you did not change your password, please contact support immediately and secure your account.
				
				This is an automated email. Please do not reply.
			`,
		};

		await transporter.sendMail(mailOptions);
		console.log(`Password changed confirmation email sent to ${to}`);
		return true;
	} catch (error) {
		console.error("Error sending password changed confirmation email:", error);
		return false;
	}
};

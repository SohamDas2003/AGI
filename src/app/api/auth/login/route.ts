import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { comparePassword } from "@/lib/auth";
import { generateToken } from "@/lib/jwt";
import { User, LoginRequest, LoginResponse } from "@/models/User";

export async function POST(request: NextRequest) {
	try {
		const body: LoginRequest = await request.json();
		const { email, password, userType } = body;

		// Validate input
		if (!email || !password || !userType) {
			return NextResponse.json(
				{
					success: false,
					message: "Email, password, and user type are required",
				} as LoginResponse,
				{ status: 400 }
			);
		}

		// Connect to database
		const { db } = await connectToDatabase();
		const usersCollection = db.collection<User>("users");

		// Find user by email and role
		const user = await usersCollection.findOne({
			email: email.toLowerCase(),
			role: userType,
		});

		if (!user) {
			return NextResponse.json(
				{
					success: false,
					message: "Invalid credentials",
				} as LoginResponse,
				{ status: 401 }
			);
		}

		// Verify password
		const isPasswordValid = await comparePassword(password, user.password);
		if (!isPasswordValid) {
			return NextResponse.json(
				{
					success: false,
					message: "Invalid credentials",
				} as LoginResponse,
				{ status: 401 }
			);
		}

		// Generate JWT token
		const token = generateToken({
			userId: user._id!.toString(),
			email: user.email,
			role: user.role,
		});

		// Return success response
		const response: LoginResponse = {
			success: true,
			message: "Login successful",
			user: {
				email: user.email,
				role: user.role,
				name: user.name,
				studentId: user.studentId,
			},
			token,
		};

		// Set HTTP-only cookie for token
		const nextResponse = NextResponse.json(response);
		nextResponse.cookies.set("auth-token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60, // 7 days
		});

		return nextResponse;
	} catch (error) {
		console.error("Login error:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Internal server error",
			} as LoginResponse,
			{ status: 500 }
		);
	}
}

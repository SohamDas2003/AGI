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
		if (!email || !password) {
			return NextResponse.json(
				{
					success: false,
					message: "Email and password are required",
				} as LoginResponse,
				{ status: 400 }
			);
		}

		// Connect to database
		const { db } = await connectToDatabase();
		const usersCollection = db.collection<User>("users");

		// Find user by email and role (if userType is provided)
		const query: { email: string; role?: "SUPERADMIN" | "ADMIN" | "STUDENT" } =
			{
				email: email.toLowerCase(),
			};
		if (userType) {
			query.role = userType as "SUPERADMIN" | "ADMIN" | "STUDENT";
		}

		const user = await usersCollection.findOne(query);

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
			name: `${user.firstName} ${user.lastName}`,
		});

		// Return success response
		const response: LoginResponse = {
			success: true,
			message: "Login successful",
			user: {
				email: user.email,
				role: user.role,
				firstName: user.firstName,
				lastName: user.lastName,
				userId: user._id!.toString(),
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

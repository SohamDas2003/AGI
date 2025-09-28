import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { comparePassword } from "@/lib/auth";
import { generateToken } from "@/lib/jwt";
import { User, LoginRequest, LoginResponse } from "@/models/User";

export async function POST(request: NextRequest) {
	try {
		// Log environment info for debugging
		console.log("🔐 Login attempt:", {
			host: request.headers.get("host"),
			origin: request.headers.get("origin"),
			userAgent: request.headers.get("user-agent"),
			forwarded: request.headers.get("x-forwarded-proto"),
			nodeEnv: process.env.NODE_ENV,
		});

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

		// Determine if we're in a secure context (HTTPS or localhost)
		const isLocalhost = request.headers.get("host")?.includes("localhost") || 
						   request.headers.get("host")?.includes("127.0.0.1");
		const isSecure = request.headers.get("x-forwarded-proto") === "https" || 
						process.env.NODE_ENV === "production";

		// Log cookie settings for debugging
		console.log("🍪 Cookie settings:", {
			isLocalhost,
			isSecure,
			nodeEnv: process.env.NODE_ENV,
			host: request.headers.get("host"),
			forwardedProto: request.headers.get("x-forwarded-proto")
		});

		nextResponse.cookies.set("auth-token", token, {
			httpOnly: true,
			secure: isLocalhost ? false : isSecure, // Only secure in production HTTPS
			sameSite: isLocalhost ? "lax" : "lax", // Use lax for better compatibility
			maxAge: 7 * 24 * 60 * 60, // 7 days
			path: "/", // Explicitly set path
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

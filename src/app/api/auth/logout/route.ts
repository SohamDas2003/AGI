import { NextResponse } from "next/server";

export async function POST() {
	try {
		const response = NextResponse.json({
			success: true,
			message: "Logged out successfully",
		});

		// Clear the auth token cookie
		response.cookies.set("auth-token", "", {
			httpOnly: true,
			secure: true, // Always secure for logout
			sameSite: "lax",
			maxAge: 0, // Expire immediately
			path: "/", // Explicitly set path
		});

		return response;
	} catch (error) {
		console.error("Logout error:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Internal server error",
			},
			{ status: 500 }
		);
	}
}

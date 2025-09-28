import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function middleware(request: NextRequest) {
	console.log("🚨🚨 MIDDLEWARE IS DEFINITELY RUNNING 🚨🚨");
	console.log("Path:", request.nextUrl.pathname);
	console.log("Environment:", process.env.NODE_ENV);
	console.log("Host:", request.headers.get("host"));
	console.log("Origin:", request.headers.get("origin"));

	// Get the token from cookies
	const token = request.cookies.get("auth-token")?.value;
	console.log("🍪 Auth token present:", !!token);

	// Check if accessing protected routes
	if (
		request.nextUrl.pathname.startsWith("/admin") ||
		request.nextUrl.pathname.startsWith("/student") ||
		request.nextUrl.pathname.startsWith("/superadmin")
	) {
		// If no token, redirect to login
		if (!token) {
			console.log("🛑 NO AUTH TOKEN - REDIRECTING TO LOGIN");
			return NextResponse.redirect(new URL("/login", request.url));
		}

		// Verify token
		try {
			const payload = verifyToken(token);
			if (!payload) {
				console.log("🛑 INVALID TOKEN - REDIRECTING TO LOGIN");
				const response = NextResponse.redirect(new URL("/login", request.url));
				// Clear invalid token
				response.cookies.delete("auth-token");
				return response;
			}

			// Check role-based access
			const userRole = payload.role;
			const path = request.nextUrl.pathname;

			// Role-based path checking
			if (path.startsWith("/superadmin") && userRole !== "SUPERADMIN") {
				console.log("🛑 UNAUTHORIZED SUPERADMIN ACCESS");
				return NextResponse.redirect(new URL("/unauthorized", request.url));
			}

			if (
				path.startsWith("/admin") &&
				!["ADMIN", "SUPERADMIN"].includes(userRole)
			) {
				console.log("🛑 UNAUTHORIZED ADMIN ACCESS");
				return NextResponse.redirect(new URL("/unauthorized", request.url));
			}

			if (path.startsWith("/student") && userRole !== "STUDENT") {
				console.log("🛑 UNAUTHORIZED STUDENT ACCESS");
				return NextResponse.redirect(new URL("/unauthorized", request.url));
			}

			console.log("✅ ACCESS GRANTED FOR", userRole, "TO", path);
		} catch (error) {
			console.error(
				"🛑 TOKEN VERIFICATION ERROR - REDIRECTING TO LOGIN",
				error
			);
			const response = NextResponse.redirect(new URL("/login", request.url));
			// Clear invalid token
			response.cookies.delete("auth-token");
			return response;
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

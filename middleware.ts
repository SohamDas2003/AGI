import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./src/lib/jwt";

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Protected routes
	const protectedRoutes = ["/dashboard", "/student-dashboard"];
	const isProtectedRoute = protectedRoutes.some((route) =>
		pathname.startsWith(route)
	);

	if (isProtectedRoute) {
		// Get token from cookie
		const token = request.cookies.get("auth-token")?.value;

		if (!token) {
			// Redirect to login if no token
			return NextResponse.redirect(new URL("/login", request.url));
		}

		// Verify token
		const payload = verifyToken(token);
		if (!payload) {
			// Redirect to login if invalid token
			const response = NextResponse.redirect(new URL("/login", request.url));
			// Clear invalid token
			response.cookies.delete("auth-token");
			return response;
		}

		// Check role-based access
		if (pathname.startsWith("/dashboard") && payload.role !== "admin") {
			return NextResponse.redirect(new URL("/student-dashboard", request.url));
		}

		if (
			pathname.startsWith("/student-dashboard") &&
			payload.role !== "student"
		) {
			return NextResponse.redirect(new URL("/dashboard", request.url));
		}
	}

	// Allow public routes and valid protected routes
	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public (public files)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|public).*)",
	],
};

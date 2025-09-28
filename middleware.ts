import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
	console.log("�🚨🚨 MIDDLEWARE IS DEFINITELY RUNNING 🚨🚨�");
	console.log("Path:", request.nextUrl.pathname);

	// If accessing superadmin without auth, redirect to login
	if (request.nextUrl.pathname.startsWith("/superadmin")) {
		console.log("🛑 BLOCKING SUPERADMIN ACCESS");
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt-edge";

export async function GET(request: NextRequest) {
	try {
		const authToken = request.cookies.get("auth-token")?.value;
		const allCookies = request.headers.get("cookie");

		// Basic cookie parsing
		const cookieMap: Record<string, string> = {};
		if (allCookies) {
			allCookies.split(";").forEach((cookie) => {
				const [name, value] = cookie.trim().split("=");
				if (name && value) {
					cookieMap[name] = decodeURIComponent(value);
				}
			});
		}

		let tokenInfo = null;
		if (authToken) {
			try {
				tokenInfo = verifyToken(authToken);
			} catch (error) {
				tokenInfo = { error: "Invalid token", details: error };
			}
		}

		return NextResponse.json({
			environment: process.env.NODE_ENV,
			host: request.headers.get("host"),
			origin: request.headers.get("origin"),
			userAgent: request.headers.get("user-agent"),
			forwardedProto: request.headers.get("x-forwarded-proto"),
			cookies: {
				authToken: authToken ? "present" : "missing",
				authTokenLength: authToken?.length || 0,
				allCookies: cookieMap,
				rawCookieHeader: allCookies,
			},
			tokenVerification: tokenInfo,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		return NextResponse.json(
			{
				error: "Debug endpoint failed",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}

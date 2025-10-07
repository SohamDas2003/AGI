/**
 * Edge-compatible JWT utilities using 'jose' library
 * This works in both Edge Runtime (middleware) and Node.js runtime (API routes)
 */

import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-change-in-production";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";

// Warn about fallback secret in production
if (
	process.env.NODE_ENV === "production" &&
	JWT_SECRET === "fallback-secret-key-change-in-production"
) {
	console.warn(
		"⚠️ WARNING: Using fallback JWT secret in production! Set JWT_SECRET environment variable."
	);
}

// Convert secret to Uint8Array for jose
const getSecretKey = () => new TextEncoder().encode(JWT_SECRET);

export interface JWTPayload {
	userId: string;
	email: string;
	role: "SUPERADMIN" | "ADMIN" | "STUDENT";
	name: string;
}

/**
 * Generate a JWT token (Edge Runtime compatible)
 */
export async function generateToken(payload: JWTPayload): Promise<string> {
	const secret = getSecretKey();
	
	const token = await new SignJWT({ ...payload })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(JWT_EXPIRE)
		.sign(secret);

	return token;
}

/**
 * Verify a JWT token (Edge Runtime compatible)
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
	try {
		const secret = getSecretKey();
		const { payload } = await jwtVerify(token, secret);
		
		// Validate payload has required fields
		if (
			typeof payload.userId === "string" &&
			typeof payload.email === "string" &&
			typeof payload.role === "string" &&
			typeof payload.name === "string"
		) {
			return payload as unknown as JWTPayload;
		}
		
		return null;
	} catch (error) {
		console.error("JWT verification failed:", error);
		return null;
	}
}

/**
 * Get token from request headers or cookies
 */
export function getTokenFromRequest(request: Request): string | null {
	// 1. Check standard Authorization header: "Bearer <token>"
	const authHeader = request.headers.get("authorization");
	if (authHeader && authHeader.startsWith("Bearer ")) {
		return authHeader.substring(7);
	}

	// 2. Check Cookie header for auth-token
	const cookieHeader = request.headers.get("cookie");
	if (cookieHeader) {
		const cookies = cookieHeader
			.split(";")
			.reduce<Record<string, string>>((acc, part) => {
				const idx = part.indexOf("=");
				if (idx > -1) {
					const name = part.slice(0, idx).trim();
					const val = part.slice(idx + 1).trim();
					acc[name] = decodeURIComponent(val);
				}
				return acc;
			}, {});

		return cookies["auth-token"] || cookies["token"] || null;
	}

	return null;
}

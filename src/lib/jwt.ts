import jwt, { Secret, SignOptions } from "jsonwebtoken";

const JWT_SECRET =
	process.env.JWT_SECRET || "fallback-secret-key-change-in-production";
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

// jsonwebtoken expects a Secret type for the secret parameter; cast once here
const JWT_SECRET_VALUE: Secret = JWT_SECRET as Secret;

export interface JWTPayload {
	userId: string;
	email: string;
	role: "SUPERADMIN" | "ADMIN" | "STUDENT";
	name: string;
}

export function generateToken(payload: JWTPayload): string {
	// cast expires value to the type accepted by SignOptions
	const options: SignOptions = {
		expiresIn: JWT_EXPIRE as unknown as SignOptions["expiresIn"],
	};
	// ensure payload matches accepted types and secret is the correct type
	return jwt.sign(
		payload as string | object | Buffer,
		JWT_SECRET_VALUE,
		options
	);
}

export function verifyToken(token: string): JWTPayload | null {
	try {
		const decoded = jwt.verify(token, JWT_SECRET_VALUE) as JWTPayload;
		return decoded;
	} catch (error) {
		console.error("JWT verification failed:", error);
		return null;
	}
}

export function getTokenFromRequest(request: Request): string | null {
	// 1. Check standard Authorization header: "Bearer <token>"
	const authHeader = request.headers.get("authorization");
	if (authHeader && authHeader.startsWith("Bearer ")) {
		return authHeader.substring(7);
	}

	// 2. Check Cookie header for common cookie names used across the app
	const cookieHeader = request.headers.get("cookie");
	if (cookieHeader) {
		// Parse simple cookie string into a map. This is intentionally small and
		// avoids external deps; it handles the typical "name=value; name2=value2" format.
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

		// Support both cookie names that have appeared in this project
		return cookies["auth-token"] || cookies["token"] || null;
	}

	// Nothing found
	return null;
}

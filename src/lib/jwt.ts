import jwt, { Secret, SignOptions } from "jsonwebtoken";

const JWT_SECRET =
	process.env.JWT_SECRET || "fallback-secret-key-change-in-production";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";

// jsonwebtoken expects a Secret type for the secret parameter; cast once here
const JWT_SECRET_VALUE: Secret = JWT_SECRET as Secret;

export interface JWTPayload {
	userId: string;
	email: string;
	role: "admin" | "student";
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
	const authHeader = request.headers.get("authorization");
	if (authHeader && authHeader.startsWith("Bearer ")) {
		return authHeader.substring(7);
	}
	return null;
}

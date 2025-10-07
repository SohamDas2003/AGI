import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt-edge";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
	try {
		// Verify authentication
		const token = request.cookies.get("auth-token")?.value;
		if (!token) {
			return NextResponse.json(
				{ success: false, error: "Not authenticated" },
				{ status: 401 }
			);
		}

		const decoded = await verifyToken(token);
		if (
			!decoded ||
			(decoded.role !== "ADMIN" && decoded.role !== "SUPERADMIN")
		) {
			return NextResponse.json(
				{ success: false, error: "Not authorized" },
				{ status: 403 }
			);
		}

		const { db } = await connectToDatabase();

		// Get all unique values from students collection
		const students = await db.collection("students").find({}).toArray();

		const batches = [
			...new Set(students.map((s) => s.batchName).filter(Boolean)),
		];
		const sites = [...new Set(students.map((s) => s.site).filter(Boolean))];
		const academicSessions = [
			...new Set(students.map((s) => s.academicSession).filter(Boolean)),
		];
		const classes = [...new Set(students.map((s) => s.class).filter(Boolean))];

		return NextResponse.json({
			success: true,
			batches: batches.sort(),
			sites: sites.sort(),
			academicSessions: academicSessions.sort(),
			classes: classes.sort(),
		});
	} catch (error) {
		console.error("Error fetching student options:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}

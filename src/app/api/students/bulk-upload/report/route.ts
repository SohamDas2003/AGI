import { NextRequest, NextResponse } from "next/server";

interface ReportData {
	row: number;
	studentName: string;
	registrationNo: string;
	rollNo: string;
	email: string;
	status: "Success" | "Failed";
	errors: string[];
}

export async function POST(req: NextRequest) {
	try {
		const { reportData } = (await req.json()) as { reportData: ReportData[] };

		if (!reportData || !Array.isArray(reportData)) {
			return NextResponse.json(
				{ error: "Invalid report data" },
				{ status: 400 }
			);
		}

		// Generate CSV content
		const headers = [
			"Row",
			"Student Name",
			"Registration No",
			"Roll No",
			"Email",
			"Status",
			"Errors",
		];

		const csvRows = [
			headers.join(","),
			...reportData.map((row) =>
				[
					row.row,
					`"${row.studentName}"`,
					`"${row.registrationNo}"`,
					`"${row.rollNo}"`,
					`"${row.email}"`,
					row.status,
					`"${row.errors.join("; ")}"`,
				].join(",")
			),
		];

		const csvContent = csvRows.join("\n");
		const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
		const filename = `bulk-upload-report-${timestamp}.csv`;

		return new NextResponse(csvContent, {
			status: 200,
			headers: {
				"Content-Type": "text/csv",
				"Content-Disposition": `attachment; filename="${filename}"`,
			},
		});
	} catch (error) {
		console.error("CSV report generation error:", error);
		return NextResponse.json(
			{ error: "Failed to generate report" },
			{ status: 500 }
		);
	}
}

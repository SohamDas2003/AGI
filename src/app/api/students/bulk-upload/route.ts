import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User, Student } from "@/models/User";
import bcrypt from "bcryptjs";
import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";

interface UploadError {
	row: number;
	field: string;
	value: string;
	error: string;
}

interface UploadResult {
	success: boolean;
	totalRecords: number;
	successfulImports: number;
	failedImports: number;
	errors: UploadError[];
	reportData: StudentReportData[];
}

interface StudentReportData {
	row: number;
	studentName: string;
	registrationNo: string;
	rollNo: string;
	email: string;
	status: "Success" | "Failed";
	errors: string[];
}

interface StudentCSVData {
	"Student Name": string;
	"Registration No": string;
	"Roll No": string;
	Site: string;
	"Batch Name": string;
	"Academic Session": string;
	Class: string;
	"Student Status": string;
	Email: string;
	Password: string;
}

// Load dropdown data
const getDropdownData = () => {
	try {
		const filePath = path.join(
			process.cwd(),
			"src/lib/student-dropdown-data.json"
		);
		const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
		return data;
	} catch (error) {
		console.error("Error loading dropdown data:", error);
		return {
			Site: ["AIMSR-Aditya Institute Of Management Studies & Research"],
			"Batch Name": ["MCA 2024-26", "MMS 2024-26"],
			"Academic Session": ["SEMESTER I", "SEMESTER III"],
			Class: ["Batch 1", "Batch 2", "Batch 3"],
			"Student Status": ["Active"],
		};
	}
};

// Extract course from batch name
const extractCourseFromBatch = (batchName: string): "MCA" | "MMS" | "PGDM" => {
	const upperBatch = batchName.toUpperCase();
	if (upperBatch.includes("MCA")) return "MCA";
	if (upperBatch.includes("MMS")) return "MMS";
	if (upperBatch.includes("PGDM")) return "PGDM";
	// Default to MCA if we can't determine
	return "MCA";
};

const REQUIRED_FIELDS = [
	"Student Name",
	"Registration No",
	"Roll No",
	"Site",
	"Batch Name",
	"Academic Session",
	"Class",
	"Student Status",
	"Email",
	"Password",
];

function validateStudentData(
	data: Record<string, unknown>,
	row: number
): { isValid: boolean; errors: UploadError[] } {
	const errors: UploadError[] = [];
	const dropdownData = getDropdownData();

	// Check required fields
	REQUIRED_FIELDS.forEach((field) => {
		const value = data[field];
		const stringValue =
			value === undefined || value === null ? "" : String(value);
		if (stringValue.trim() === "") {
			errors.push({
				row,
				field,
				value: stringValue,
				error: `${field} is required`,
			});
		}
	});

	// Validate email format
	if (data["Email"] && typeof data["Email"] === "string") {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(data["Email"])) {
			errors.push({
				row,
				field: "Email",
				value: data["Email"],
				error: "Invalid email format",
			});
		}
	}

	// Validate dropdown values
	const dropdownFields = [
		"Site",
		"Batch Name",
		"Academic Session",
		"Class",
		"Student Status",
	];
	dropdownFields.forEach((field) => {
		const value = data[field];
		if (
			value &&
			typeof value === "string" &&
			!dropdownData[field].includes(value)
		) {
			errors.push({
				row,
				field,
				value: value,
				error: `${field} must be one of: ${dropdownData[field].join(", ")}`,
			});
		}
	});

	return { isValid: errors.length === 0, errors };
}

async function processExcelFile(buffer: Buffer): Promise<StudentCSVData[]> {
	const workbook = XLSX.read(buffer);
	const sheetName = workbook.SheetNames[0];
	const worksheet = workbook.Sheets[sheetName];

	// Convert to JSON with header row as keys
	const data = XLSX.utils.sheet_to_json(worksheet);
	return data as StudentCSVData[];
}

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
		}

		// Validate file type
		const allowedTypes = [
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			"text/csv",
			"application/vnd.ms-excel",
		];

		if (
			!allowedTypes.includes(file.type) &&
			!file.name.endsWith(".xlsx") &&
			!file.name.endsWith(".csv")
		) {
			return NextResponse.json(
				{
					error:
						"Invalid file type. Please upload an Excel (.xlsx) or CSV file.",
				},
				{ status: 400 }
			);
		}

		// Validate file size (10MB limit)
		if (file.size > 10 * 1024 * 1024) {
			return NextResponse.json(
				{ error: "File size exceeds 10MB limit" },
				{ status: 400 }
			);
		}

		// Process file
		const buffer = Buffer.from(await file.arrayBuffer());
		let studentsData: StudentCSVData[];

		if (file.name.endsWith(".csv")) {
			// For CSV files, convert to Excel format first
			const csvText = buffer.toString("utf-8");
			const workbook = XLSX.read(csvText, { type: "string" });
			const sheetName = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[sheetName];
			studentsData = XLSX.utils.sheet_to_json(worksheet) as StudentCSVData[];
		} else {
			studentsData = await processExcelFile(buffer);
		}

		if (studentsData.length === 0) {
			return NextResponse.json(
				{ error: "No data found in the uploaded file" },
				{ status: 400 }
			);
		}

		if (studentsData.length > 1000) {
			return NextResponse.json(
				{ error: "Maximum 1000 records allowed per upload" },
				{ status: 400 }
			);
		}

		// Connect to database
		const { db } = await connectToDatabase();
		const usersCollection = db.collection<User>("users");
		const studentsCollection = db.collection<Student>("students");

		// Validate all records first
		const allErrors: UploadError[] = [];
		const validStudents: StudentCSVData[] = [];
		const reportData: StudentReportData[] = [];

		for (let i = 0; i < studentsData.length; i++) {
			const student = studentsData[i];
			const rowNum = i + 2; // +2 because row 1 is header
			const { isValid, errors } = validateStudentData(
				student as unknown as Record<string, unknown>,
				rowNum
			);

			const studentReport: StudentReportData = {
				row: rowNum,
				studentName: student["Student Name"] || "",
				registrationNo: student["Registration No"] || "",
				rollNo: student["Roll No"] || "",
				email: student["Email"] || "",
				status: "Failed",
				errors: [],
			};

			if (isValid) {
				// Check for duplicate email
				const existingUser = await usersCollection.findOne({
					email: student["Email"],
				});
				if (existingUser) {
					const error = {
						row: rowNum,
						field: "Email",
						value: student["Email"],
						error: "Email already exists",
					};
					allErrors.push(error);
					studentReport.errors.push("Email already exists");
				} else {
					// Check for duplicate registration number
					const existingStudent = await studentsCollection.findOne({
						registrationNo: student["Registration No"],
					});
					if (existingStudent) {
						const error = {
							row: rowNum,
							field: "Registration No",
							value: student["Registration No"],
							error: "Registration number already exists",
						};
						allErrors.push(error);
						studentReport.errors.push("Registration number already exists");
					} else {
						validStudents.push(student);
						studentReport.status = "Success";
					}
				}
			} else {
				allErrors.push(...errors);
				studentReport.errors.push(...errors.map((e) => e.error));
			}

			reportData.push(studentReport);
		}

		// Insert valid students
		let successfulImports = 0;

		for (const student of validStudents) {
			try {
				// Hash password
				const hashedPassword = await bcrypt.hash(student["Password"], 12);

				// Extract first and last name from full name
				const nameParts = student["Student Name"].trim().split(" ");
				const firstName = nameParts[0] || "";
				const lastName = nameParts.slice(1).join(" ") || "";

				// Extract course from batch name
				const course = extractCourseFromBatch(student["Batch Name"]);

				// Create user document
				const newUser: User = {
					email: student["Email"],
					password: hashedPassword,
					role: "STUDENT",
					firstName: firstName,
					lastName: lastName,
					createdAt: new Date(),
					updatedAt: new Date(),
				};

				const userResult = await usersCollection.insertOne(newUser);
				const userId = userResult.insertedId;

				// Create student document
				const newStudent: Student = {
					userId: userId,
					studentName: student["Student Name"],
					registrationNo: student["Registration No"],
					rollNo: student["Roll No"],
					site: student["Site"],
					batchName: student["Batch Name"],
					academicSession: student["Academic Session"],
					class: student["Class"],
					course: course,
					studentStatus: student["Student Status"] as "Active" | "Inactive",
					email: student["Email"],
					assessmentStatus: [],
					unreadNotifications: 0,
					createdAt: new Date(),
					updatedAt: new Date(),
				};

				await studentsCollection.insertOne(newStudent);
				successfulImports++;
			} catch (error) {
				console.error(
					"Error inserting student:",
					student["Student Name"],
					error
				);
				// Find the row number for this student and update report
				const reportIndex = reportData.findIndex(
					(r) => r.email === student["Email"]
				);
				if (reportIndex !== -1) {
					reportData[reportIndex].status = "Failed";
					reportData[reportIndex].errors.push(
						`Failed to create student account: ${
							error instanceof Error ? error.message : "Unknown error"
						}`
					);
				}

				allErrors.push({
					row: reportIndex + 2,
					field: "general",
					value: student["Email"],
					error: `Failed to create student account: ${
						error instanceof Error ? error.message : "Unknown error"
					}`,
				});
			}
		}

		const result: UploadResult = {
			success: allErrors.length === 0,
			totalRecords: studentsData.length,
			successfulImports,
			failedImports: studentsData.length - successfulImports,
			errors: allErrors,
			reportData,
		};

		return NextResponse.json(result);
	} catch (error) {
		console.error("Bulk upload error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

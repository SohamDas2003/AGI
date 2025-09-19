import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import * as XLSX from "xlsx";

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
}

interface StudentCSVData {
	student_id: string;
	roll_number: string;
	email: string;
	first_name: string;
	last_name: string;
	course: string;
	division: string;
	password: string;
	year_of_study?: number;
	date_of_birth?: string;
	phone?: string;
	address?: string;
	gender?: string;
}

const SUPPORTED_COURSES = ["MMS", "MCA", "PGDM"];

const REQUIRED_FIELDS = [
	"student_id",
	"roll_number",
	"email",
	"first_name",
	"last_name",
	"course",
	"division",
	"password",
];

function validateStudentData(
	data: Record<string, unknown>,
	row: number
): { isValid: boolean; errors: UploadError[] } {
	const errors: UploadError[] = [];

	// Check required fields
	REQUIRED_FIELDS.forEach((field) => {
		const value = data[field];
		if (!value || value.toString().trim() === "") {
			errors.push({
				row,
				field,
				value: value?.toString() || "",
				error: `${field} is required`,
			});
		}
	});

	// Validate email format
	if (data.email && typeof data.email === "string") {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(data.email)) {
			errors.push({
				row,
				field: "email",
				value: data.email,
				error: "Invalid email format",
			});
		}
	}

	// Validate course
	if (
		data.course &&
		typeof data.course === "string" &&
		!SUPPORTED_COURSES.includes(data.course)
	) {
		errors.push({
			row,
			field: "course",
			value: data.course,
			error: `Course must be one of: ${SUPPORTED_COURSES.join(", ")}`,
		});
	}

	// Validate year of study if provided
	if (data.year_of_study) {
		const yearValue = Number(data.year_of_study);
		if (isNaN(yearValue) || yearValue < 1 || yearValue > 4) {
			errors.push({
				row,
				field: "year_of_study",
				value: data.year_of_study.toString(),
				error: "Year of study must be a number between 1 and 4",
			});
		}
	}

	// Validate date of birth if provided
	if (data.date_of_birth && typeof data.date_of_birth === "string") {
		const date = new Date(data.date_of_birth);
		if (isNaN(date.getTime())) {
			errors.push({
				row,
				field: "date_of_birth",
				value: data.date_of_birth,
				error: "Invalid date format",
			});
		}
	}

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

		// Validate all records first
		const allErrors: UploadError[] = [];
		const validStudents: StudentCSVData[] = [];

		for (let i = 0; i < studentsData.length; i++) {
			const student = studentsData[i];
			const { isValid, errors } = validateStudentData(
				student as unknown as Record<string, unknown>,
				i + 2
			); // +2 because row 1 is header

			if (isValid) {
				// Check for duplicate email
				const existingUser = await usersCollection.findOne({
					email: student.email,
				});
				if (existingUser) {
					allErrors.push({
						row: i + 2,
						field: "email",
						value: student.email,
						error: "Email already exists",
					});
				} else {
					// Check for duplicate student ID - we'll check by a combination of first name, last name and email
					// since User interface doesn't have studentId field
					const existingStudent = await usersCollection.findOne({
						firstName: student.first_name,
						lastName: student.last_name,
						email: student.email,
					});
					if (existingStudent) {
						allErrors.push({
							row: i + 2,
							field: "student_id",
							value: student.student_id,
							error: "Student with same name and email already exists",
						});
					} else {
						validStudents.push(student);
					}
				}
			} else {
				allErrors.push(...errors);
			}
		}

		// Insert valid students
		let successfulImports = 0;

		for (const student of validStudents) {
			try {
				// Hash password
				const hashedPassword = await bcrypt.hash(student.password, 12);

				// Create user document
				const newUser: User = {
					email: student.email,
					password: hashedPassword,
					role: "STUDENT",
					firstName: student.first_name,
					lastName: student.last_name,
					createdAt: new Date(),
					updatedAt: new Date(),
				};

				await usersCollection.insertOne(newUser);
				successfulImports++;
			} catch (error) {
				console.error("Error inserting student:", student.student_id, error);
				// Find the row number for this student
				const rowIndex = studentsData.findIndex(
					(s) => s.student_id === student.student_id
				);
				allErrors.push({
					row: rowIndex + 2,
					field: "general",
					value: student.student_id,
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

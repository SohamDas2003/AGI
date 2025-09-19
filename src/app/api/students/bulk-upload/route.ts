import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User, StudentBulkUpload } from "@/models/User";
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

const SUPPORTED_COURSES = [
	"MMS",
	"MCA",
	"PGDM",
];

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

async function processExcelFile(buffer: Buffer): Promise<StudentBulkUpload[]> {
	const workbook = XLSX.read(buffer);
	const sheetName = workbook.SheetNames[0];
	const worksheet = workbook.Sheets[sheetName];

	// Convert to JSON with header row as keys
	const data = XLSX.utils.sheet_to_json(worksheet);
	return data as StudentBulkUpload[];
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
		let studentsData: StudentBulkUpload[];

		if (file.name.endsWith(".csv")) {
			// For CSV files, convert to Excel format first
			const csvText = buffer.toString("utf-8");
			const workbook = XLSX.read(csvText, { type: "string" });
			const sheetName = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[sheetName];
			studentsData = XLSX.utils.sheet_to_json(worksheet) as StudentBulkUpload[];
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
		const validStudents: StudentBulkUpload[] = [];

		for (let i = 0; i < studentsData.length; i++) {
			const student = studentsData[i];
			const { isValid, errors } = validateStudentData(
				student as Record<string, unknown>,
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
					// Check for duplicate student ID
					const existingStudent = await usersCollection.findOne({
						studentId: student.student_id,
					});
					if (existingStudent) {
						allErrors.push({
							row: i + 2,
							field: "student_id",
							value: student.student_id,
							error: "Student ID already exists",
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
					role: "student",
					studentId: student.student_id,
					rollNumber: student.roll_number,
					firstName: student.first_name,
					lastName: student.last_name,
					name: `${student.first_name} ${student.last_name}`,
					course: student.course,
					division: student.division,
					phone: student.phone,
					dateOfBirth: student.date_of_birth
						? new Date(student.date_of_birth)
						: undefined,
					gender: student.gender,
					yearOfStudy: student.year_of_study
						? Number(student.year_of_study)
						: undefined,
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

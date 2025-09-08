/**
 * Utility functions for bulk upload processing
 */

/**
 * Generate a unique student ID based on course and year
 */
export function generateStudentId(
	course: string,
	year: number = new Date().getFullYear()
): string {
	const coursePrefix = course.substring(0, 3).toUpperCase();
	const yearSuffix = year.toString().slice(-2);
	const randomSuffix = Math.floor(Math.random() * 1000)
		.toString()
		.padStart(3, "0");
	return `${coursePrefix}${yearSuffix}${randomSuffix}`;
}

/**
 * Validate student data format
 */
export function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * Validate phone number format
 */
export function isValidPhoneNumber(phone: string): boolean {
	const phoneRegex = /^\+\d{1,3}-\d{10}$/;
	return phoneRegex.test(phone);
}

/**
 * Parse date from various formats
 */
export function parseDate(dateString: string): Date | null {
	try {
		const date = new Date(dateString);
		if (isNaN(date.getTime())) {
			return null;
		}
		return date;
	} catch {
		return null;
	}
}

/**
 * Generate a secure random password
 */
export function generateSecurePassword(length: number = 12): string {
	const charset =
		"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
	let password = "";
	for (let i = 0; i < length; i++) {
		password += charset.charAt(Math.floor(Math.random() * charset.length));
	}
	return password;
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
	return input.trim().replace(/[<>]/g, "");
}

/**
 * Validate course name
 */
export function isValidCourse(course: string): boolean {
	const supportedCourses = [
		"MBA",
		"MCA",
		"PGDM",
		"BMS",
		"B.Arch.",
		"BFA Applied Art",
		"B.Voc. Interior Design",
		"M.Arch",
	];
	return supportedCourses.includes(course);
}

/**
 * Validate year of study
 */
export function isValidYearOfStudy(year: number): boolean {
	return year >= 1 && year <= 4;
}

export const BULK_UPLOAD_CONSTANTS = {
	MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
	MAX_RECORDS: 1000,
	SUPPORTED_COURSES: [
		"MBA",
		"MCA",
		"PGDM",
		"BMS",
		"B.Arch.",
		"BFA Applied Art",
		"B.Voc. Interior Design",
		"M.Arch",
	],
	REQUIRED_FIELDS: [
		"student_id",
		"roll_number",
		"email",
		"first_name",
		"last_name",
		"course",
		"division",
		"password",
	],
	OPTIONAL_FIELDS: ["phone", "date_of_birth", "gender", "year_of_study"],
};

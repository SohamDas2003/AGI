import { ObjectId } from "mongodb";

export interface User {
	_id?: ObjectId | string;
	email: string;
	password: string;
	role: "admin" | "student";
	name?: string;
	studentId?: string;
	rollNumber?: string;
	firstName?: string;
	lastName?: string;
	course?: string;
	division?: string;
	phone?: string;
	dateOfBirth?: Date;
	gender?: string;
	yearOfStudy?: number;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface StudentBulkUpload extends Record<string, unknown> {
	student_id: string;
	roll_number: string;
	email: string;
	first_name: string;
	last_name: string;
	course: string;
	division: string;
	password: string;
	phone?: string;
	date_of_birth?: string;
	gender?: string;
	year_of_study?: number;
}

export interface LoginRequest {
	email: string;
	password: string;
	userType: "admin" | "student";
}

export interface LoginResponse {
	success: boolean;
	message: string;
	user?: {
		email: string;
		role: "admin" | "student";
		name?: string;
		studentId?: string;
	};
	token?: string;
}

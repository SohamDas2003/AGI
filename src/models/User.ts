import { ObjectId } from "mongodb";

export interface User {
	_id?: ObjectId | string;
	email: string;
	password: string;
	role: "SUPERADMIN" | "ADMIN" | "STUDENT";
	firstName: string;
	lastName: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface Student {
	_id?: ObjectId | string;
	userId: ObjectId | string; // Reference to User collection
	studentName: string;
	registrationNo: string;
	rollNo: string;
	site: string;
	batchName: string;
	academicSession: string;
	class: string;
	studentStatus: "Active" | "Inactive";
	email: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface StudentBulkUpload extends Record<string, unknown> {
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

export interface LoginRequest {
	email: string;
	password: string;
	userType?: string; // Optional, will determine role from DB
}

export interface LoginResponse {
	success: boolean;
	message: string;
	user?: {
		email: string;
		role: "SUPERADMIN" | "ADMIN" | "STUDENT";
		firstName: string;
		lastName: string;
		userId: string;
	};
	token?: string;
}

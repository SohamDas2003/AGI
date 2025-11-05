import { ObjectId } from "mongodb";

export interface User {
	_id?: ObjectId | string;
	email: string;
	password: string;
	role: "SUPERADMIN" | "ADMIN" | "STUDENT";
	firstName: string;
	lastName: string;
	resetPasswordToken?: string;
	resetPasswordExpires?: Date;
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
	course: "MCA" | "MMS" | "PGDM"; // Added course field for assessment targeting
	studentStatus: "Active" | "Inactive";
	email: string;

	// Assessment-related fields
	assessmentStatus?: {
		assessmentId: ObjectId | string;
		status:
			| "eligible"
			| "assigned"
			| "started"
			| "completed"
			| "overdue"
			| "excluded";
		assignedAt?: Date;
		lastAccessedAt?: Date;
		attempts: number;
		lastAttemptAt?: Date;
		autoAssigned: boolean;
	}[];

	// Notifications
	unreadNotifications?: number;
	lastNotificationCheck?: Date;

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
	Course: "MCA" | "MMS" | "PGDM"; // Added course field
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

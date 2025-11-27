import { ObjectId } from "mongodb";

// Assessment Question Schema with 5-point scale
export interface AssessmentQuestion {
	id: string; // Unique ID within the assessment
	text: string;
	questionType: "scale"; // Currently only scale type
	scaleOptions: {
		min: number; // 1
		max: number; // 5
		minLabel: string; // "Beginner"
		maxLabel: string; // "Expert"
		labels: string[]; // ["Beginner", "Elementary", "Intermediate", "Advanced", "Expert"]
	};
	order: number; // For ordering questions within section
	isRequired: boolean;
}

// Assessment Section Schema (embedded in Assessment)
export interface AssessmentSection {
	id: string; // Unique ID within the assessment
	title: string;
	description?: string;
	order: number; // For ordering sections
	questions: AssessmentQuestion[]; // Embedded questions
}

// Student Assignment Criteria
export interface AssessmentCriteria {
	course: ("MCA" | "MMS" | "PGDM" | "ALL")[];
	// Optional: PGDM subject specializations when PGDM is selected
	pgdmSpecializations?: (
		| "Marketing"
		| "Finance"
		| "Human Resources"
		| "Operations"
		| "Information Technology"
	)[];
	batches: string[]; // Specific batches
	sites?: string[]; // Optional: specific sites
	academicSessions?: string[]; // Optional: specific academic sessions
	classes?: string[]; // Optional: specific classes
	studentStatus?: ("Active" | "Inactive")[]; // Default: ["Active"]
}

// Main Assessment Schema (Single Document)
export interface Assessment {
	_id?: ObjectId | string;
	title: string;
	description?: string;

	// Embedded sections and questions
	sections: AssessmentSection[];

	// Student assignment criteria
	criteria: AssessmentCriteria;

	// Assessment settings
	status: "draft" | "active" | "completed" | "archived";
	timeLimit?: number; // Time limit in minutes (optional)
	instructions?: string;
	allowMultipleAttempts: boolean;
	maxAttempts?: number;

	// Auto-assignment settings
	autoAssign: boolean; // Whether to automatically assign to students matching criteria
	assignOnLogin: boolean; // Whether to assign when eligible students log in

	// Metadata
	createdBy: ObjectId | string; // Admin who created it
	createdAt?: Date;
	updatedAt?: Date;
	publishedAt?: Date;
	closedAt?: Date;

	// Analytics (computed)
	stats?: {
		totalEligibleStudents: number;
		totalAssigned: number;
		totalStarted: number;
		totalCompleted: number;
		completionRate: number;
		averageScore: number;
		averageTimeSpent: number; // in minutes
	};
}

// Student Assessment Response Schema
export interface AssessmentResponse {
	_id?: ObjectId | string;
	assessmentId: ObjectId | string;
	studentId: ObjectId | string;
	attemptNumber: number;
	answers: {
		questionId: string; // Question ID within assessment
		sectionId: string; // Section ID within assessment
		selectedValue: number; // 1-5 scale value
		timeSpent?: number; // Time spent on this question in seconds
	}[];
	status: "not_started" | "in_progress" | "completed" | "submitted";
	startedAt?: Date;
	completedAt?: Date;
	submittedAt?: Date;
	timeSpent: number; // Total time spent in seconds
	ipAddress?: string;
	userAgent?: string;

	// Computed scores
	sectionScores?: {
		sectionId: string;
		score: number; // Average score for this section
		maxPossibleScore: number;
		percentage: number;
	}[];
	overallScore?: number;
	overallPercentage?: number;
}

// Assessment Assignment Status (embedded in Student model or separate collection)
export interface StudentAssessmentStatus {
	_id?: ObjectId | string;
	assessmentId: ObjectId | string;
	studentId: ObjectId | string;
	status:
		| "eligible"
		| "assigned"
		| "started"
		| "completed"
		| "overdue"
		| "excluded";
	assignedAt?: Date;
	assignedBy?: ObjectId | string; // Admin who assigned (if manually assigned)
	autoAssigned: boolean; // Whether this was auto-assigned based on criteria
	dueDate?: Date;
	lastAccessedAt?: Date;
	remindersSent: number;
	lastReminderAt?: Date;
	completedAt?: Date;
	attempts: number;
	lastAttemptAt?: Date;
}

// Assessment Notification Schema
export interface AssessmentNotification {
	_id?: ObjectId | string;
	assessmentId: ObjectId | string;
	studentId: ObjectId | string;
	type:
		| "assignment"
		| "reminder"
		| "deadline"
		| "completion"
		| "new_assessment";
	title: string;
	message: string;
	isRead: boolean;
	sentAt: Date;
	readAt?: Date;
	actionUrl?: string; // URL to take the assessment
}

// Assessment Analytics (can be computed on-demand or cached)
export interface AssessmentAnalytics {
	_id?: ObjectId | string;
	assessmentId: ObjectId | string;

	// Overall statistics
	totalEligibleStudents: number;
	totalAssigned: number;
	totalStarted: number;
	totalCompleted: number;
	completionRate: number; // Percentage
	averageTimeSpent: number; // In minutes

	// Score analytics
	overallAverageScore: number;
	scoreDistribution: {
		range: string; // e.g., "1-2", "2-3", etc.
		count: number;
		percentage: number;
	}[];

	// Section-wise analytics
	sectionAnalytics: {
		sectionId: string;
		sectionTitle: string;
		averageScore: number; // Average of all question scores in section
		responseCount: number;
		completionRate: number;

		// Question-wise analytics within section
		questionAnalytics: {
			questionId: string;
			questionText: string;
			averageScore: number;
			responseDistribution: {
				value: number; // 1-5
				count: number;
				percentage: number;
			}[];
			skipRate: number; // Percentage of students who skipped (if not required)
		}[];
	}[];

	// Performance by student criteria
	performanceByBatch?: {
		batch: string;
		averageScore: number;
		completionRate: number;
		studentCount: number;
	}[];

	performanceByCourse?: {
		course: string;
		averageScore: number;
		completionRate: number;
		studentCount: number;
	}[];

	lastUpdated: Date;
}

// Assessment Template Schema (for reusable assessment templates)
export interface AssessmentTemplate {
	_id?: ObjectId | string;
	name: string;
	description?: string;
	sections: {
		title: string;
		description?: string;
		questions: {
			text: string;
			scaleOptions: AssessmentQuestion["scaleOptions"];
			isRequired: boolean;
		}[];
	}[];
	category: string; // e.g., "Placement Assessment", "Feedback Survey"
	isPublic: boolean; // Whether other admins can use this template
	createdBy: ObjectId | string;
	usageCount: number;
	createdAt?: Date;
	updatedAt?: Date;
}

// Bulk Assessment Operations
export interface BulkAssessmentOperation {
	_id?: ObjectId | string;
	operationType: "assign" | "remind" | "close" | "export" | "auto_assign";
	assessmentId: ObjectId | string;
	performedBy: ObjectId | string;
	targetCriteria?: AssessmentCriteria; // For auto-assignment operations
	targetStudents?: ObjectId[] | string[]; // For manual assignment operations
	status: "pending" | "in_progress" | "completed" | "failed";
	startedAt: Date;
	completedAt?: Date;
	results: {
		successful: number;
		failed: number;
		errors: string[];
		studentsProcessed?: string[]; // Student IDs that were processed
	};
}

// Assessment Export Schema
export interface AssessmentExport {
	_id?: ObjectId | string;
	assessmentId: ObjectId | string;
	exportType: "responses" | "analytics" | "summary" | "eligible_students";
	format: "csv" | "excel" | "pdf";
	filters?: {
		status?: string[];
		course?: string[];
		batch?: string[];
		dateRange?: {
			start: Date;
			end: Date;
		};
	};
	requestedBy: ObjectId | string;
	status: "pending" | "processing" | "completed" | "failed";
	fileUrl?: string;
	fileName?: string;
	expiresAt?: Date;
	createdAt: Date;
}

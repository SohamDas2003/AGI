// Assessment and Placement Related Types
export interface SkillScores {
	domainSkills: number;
	communicationSkills: number;
	digitalSkills: number;
	interpersonalSkills: number;
	creativitySkills: number;
}

export type AssessmentStatus = "active" | "draft" | "completed" | "archived";

export interface Assessment {
	_id: string;
	studentId: string;
	skillScores: SkillScores;
	overallScore: number;
	placementRecommended: boolean;
	assessmentDate: Date;
	completionStatus: "pending" | "in_progress" | "completed";
	timeSpent: number; // in minutes
	answers: AssessmentAnswer[];
}

// Assessment Template/Configuration
export interface AssessmentTemplate {
	id: string;
	title: string;
	description: string;
	skills: string[];
	createdBy: string;
	createdAt: Date;
	updatedAt: Date;
	status: AssessmentStatus;
	totalQuestions: number;
	duration: number; // in minutes
	studentsAssigned: number;
	studentsCompleted: number;
}

export interface AssessmentAnswer {
	questionId: string;
	selectedAnswer: string;
	isCorrect: boolean;
	timeSpent: number;
}

// Student Related Types
export interface Student {
	_id: string;
	studentId: string;
	rollNumber: string;
	email: string;
	firstName: string;
	lastName: string;
	course:
		| "MBA"
		| "MCA"
		| "PGDM"
		| "BMS"
		| "B.Arch."
		| "BFA Applied Art"
		| "B.Voc. Interior Design"
		| "M.Arch";
	division: string;
	phone?: string;
	dateOfBirth?: Date;
	gender?: "Male" | "Female" | "Other";
	yearOfStudy?: number;
	specialization?: string;
	status: "active" | "inactive" | "suspended";
	isFirstLogin: boolean;
	lastLoginAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	// For display purposes
	fullName?: string;
	latestAssessment?: Assessment;
}

// Admin Related Types
export interface Admin {
	_id: string;
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	role: "admin" | "super_admin";
	permissions: Permission[];
	lastLoginAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface Permission {
	module: string;
	actions: string[];
}

// Dashboard and Analytics Types
export interface DashboardMetrics {
	totalStudents: number;
	totalStudentsChange: number;
	activeAssessments: number;
	activeAssessmentsChange: number;
	completedAssessments: number;
	completedAssessmentsChange: number;
	averageOverallScore: number;
	averageOverallScoreChange: number;
	placementRecommendationRate: number;
	placementRecommendationRateChange: number;
}

export interface SkillAnalytics {
	skill: string;
	averageScore: number;
	totalAssessments: number;
	improvementTrend: number;
}

export interface CourseAnalytics {
	course: string;
	totalStudents: number;
	averageScore: number;
	placementRate: number;
	topPerformers: number;
}

export interface ChartData {
	date: string;
	overallScore: number;
	domainSkills: number;
	communicationSkills: number;
	digitalSkills: number;
	interpersonalSkills: number;
	creativitySkills: number;
}

// Bulk Upload Types
export interface BulkUploadResult {
	success: boolean;
	totalRecords: number;
	successfulImports: number;
	failedImports: number;
	errors: BulkUploadError[];
}

export interface BulkUploadError {
	row: number;
	field: string;
	value: string;
	error: string;
}

export interface StudentUploadData {
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

// Assessment Question Types
export interface AssessmentQuestion {
	_id: string;
	questionText: string;
	options: string[];
	correctAnswer: string;
	skillCategory: keyof SkillScores;
	difficulty: "easy" | "medium" | "hard";
	points: number;
}

// Filter and Search Types
export interface StudentFilters {
	course?: string;
	division?: string;
	status?: string;
	assessmentStatus?: string;
	dateRange?: {
		start: Date;
		end: Date;
	};
}

export interface AssessmentFilters {
	course?: string;
	completionStatus?: string;
	scoreRange?: {
		min: number;
		max: number;
	};
	dateRange?: {
		start: Date;
		end: Date;
	};
}

// Report Types
export interface ReportConfig {
	type:
		| "student_performance"
		| "skill_analysis"
		| "course_overview"
		| "placement_analytics";
	format: "pdf" | "excel" | "csv";
	filters: StudentFilters | AssessmentFilters;
	dateRange: {
		start: Date;
		end: Date;
	};
}

// API Response Types
export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

export interface PaginatedResponse<T> {
	data: T[];
	pagination: {
		currentPage: number;
		totalPages: number;
		totalRecords: number;
		pageSize: number;
	};
}

// Navigation Types
export interface NavigationItem {
	name: string;
	href: string;
	icon: React.ComponentType<{ className?: string }>;
	current: boolean;
	badge?: number;
	children?: NavigationItem[];
}

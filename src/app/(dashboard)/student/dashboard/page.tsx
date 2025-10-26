"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import {
	Target,
	Clock,
	Users,
	PlayCircle,
	CheckCircle,
	Eye,
} from "lucide-react";

interface StudentData {
	studentName: string;
	registrationNo: string;
	rollNo: string;
	batchName: string;
	academicSession: string;
	class: string;
	studentStatus: string;
}

interface AssessmentItem {
	_id: string;
	title: string;
	description: string;
	course: string;
	batch: string;
	timeLimit?: number;
	totalQuestions: number;
	status: "active" | "draft" | "completed";
	attempts: {
		current: number;
		max: number;
		allowed: boolean;
	};
	lastAttempt?: {
		completedAt: string;
		score?: number;
	};
}

function StudentDashboard() {
	const [studentData, setStudentData] = useState<StudentData | null>(null);
	const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [assessmentsLoading, setAssessmentsLoading] = useState(true);

	useEffect(() => {
		const fetchStudentData = async () => {
			try {
				// Get current user
				const userResponse = await fetch("/api/auth/me");
				if (userResponse.ok) {
					const userData = await userResponse.json();

					// Get student details
					const studentResponse = await fetch(
						`/api/students/list?search=${userData.user.email}&limit=1`
					);
					if (studentResponse.ok) {
						const studentData = await studentResponse.json();
						if (studentData.students.length > 0) {
							setStudentData(studentData.students[0]);
						}
					}
				}
			} catch (error) {
				console.error("Error fetching student data:", error);
			} finally {
				setLoading(false);
			}
		};

		const fetchAssessments = async () => {
			try {
				const response = await fetch("/api/assessments/student/assigned", {
					credentials: "include",
				});

				if (response.ok) {
					const result = await response.json();
					if (result.success) {
						// Show only assigned assessments (not completed)
						const assignedOnly = (result.assessments || []).filter(
							(a: AssessmentItem) => a.status === "active" && !a.lastAttempt
						);
						setAssessments(assignedOnly);
					}
				}
			} catch (error) {
				console.error("Error fetching assessments:", error);
			} finally {
				setAssessmentsLoading(false);
			}
		};

		fetchStudentData();
		fetchAssessments();
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-lg">Loading dashboard...</div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto space-y-6">
			{/* Page Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Student Dashboard
				</h1>
				<p className="text-gray-600">
					Track your academic performance and placement readiness
				</p>
			</div>

			{/* Student Info Card */}
			{studentData && (
				<div className="bg-white p-6 rounded-lg shadow mb-6">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						Your Information
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<p className="text-sm font-medium text-gray-600">Student Name</p>
							<p className="text-lg text-gray-900">{studentData.studentName}</p>
						</div>
						<div>
							<p className="text-sm font-medium text-gray-600">
								Registration Number
							</p>
							<p className="text-lg text-gray-900">
								{studentData.registrationNo}
							</p>
						</div>
						<div>
							<p className="text-sm font-medium text-gray-600">Roll Number</p>
							<p className="text-lg text-gray-900">{studentData.rollNo}</p>
						</div>
						<div>
							<p className="text-sm font-medium text-gray-600">Batch</p>
							<p className="text-lg text-gray-900">{studentData.batchName}</p>
						</div>
						<div>
							<p className="text-sm font-medium text-gray-600">
								Academic Session
							</p>
							<p className="text-lg text-gray-900">
								{studentData.academicSession}
							</p>
						</div>
						<div>
							<p className="text-sm font-medium text-gray-600">Status</p>
							<span
								className={`px-2 py-1 rounded-full text-sm ${
									studentData.studentStatus === "Active"
										? "bg-green-100 text-green-800"
										: "bg-red-100 text-red-800"
								}`}>
								{studentData.studentStatus}
							</span>
						</div>
					</div>
				</div>
			)}

			{/* Assigned Assessments */}
			<div className="bg-white p-6 rounded-lg shadow">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
						<Target className="w-5 h-5 text-blue-600" />
						Assigned Assessments
					</h2>
					<Link
						href="/student/assessments"
						className="text-sm text-blue-600 hover:text-blue-700 font-medium">
						View All
					</Link>
				</div>

				{assessmentsLoading ? (
					<div className="text-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
						<p className="text-gray-600 text-sm">Loading assessments...</p>
					</div>
				) : assessments.length === 0 ? (
					<div className="text-center py-8">
						<Target className="w-12 h-12 text-gray-300 mx-auto mb-2" />
						<p className="text-gray-600">No pending assessments</p>
						<p className="text-sm text-gray-500 mt-1">
							Check back later for new assignments
						</p>
					</div>
				) : (
					<div className="space-y-4">
						{assessments.map((assessment) => (
							<div
								key={assessment._id}
								className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
								<div className="flex items-start justify-between gap-4">
									<div className="flex-1 min-w-0">
										<h3 className="font-semibold text-gray-900 mb-1 break-words">
											{assessment.title}
										</h3>
										{assessment.description && (
											<p className="text-sm text-gray-600 mb-3 line-clamp-2 break-words">
												{assessment.description}
											</p>
										)}
										<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-600">
											<span className="flex items-center gap-1">
												<Users className="w-3 h-3" />
												{assessment.totalQuestions} Questions
											</span>
											{assessment.timeLimit && (
												<span className="flex items-center gap-1">
													<Clock className="w-3 h-3" />
													{assessment.timeLimit} minutes
												</span>
											)}
											<span className="flex items-center gap-1">
												<span className="font-medium">Attempts:</span>
												{assessment.attempts.current} /{" "}
												{assessment.attempts.max}
											</span>
										</div>
									</div>
									<div className="flex flex-col gap-2 flex-shrink-0">
										{assessment.attempts.allowed ? (
											<Link
												href={`/student/assessments/${assessment._id}/take`}
												className="inline-flex items-center justify-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm whitespace-nowrap">
												<PlayCircle className="w-3 h-3 mr-1" />
												{assessment.attempts.current > 0 ? "Retake" : "Start"}
											</Link>
										) : assessment.lastAttempt ? (
											<Link
												href={`/student/assessments/${assessment._id}/results`}
												className="inline-flex items-center justify-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm whitespace-nowrap">
												<CheckCircle className="w-3 h-3 mr-1" />
												View Results
											</Link>
										) : null}
										<Link
											href={`/student/assessments/${assessment._id}`}
											className="inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm whitespace-nowrap">
											<Eye className="w-3 h-3 mr-1" />
											Details
										</Link>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

export default function ProtectedStudentDashboard() {
	return (
		<ProtectedRoute allowedRoles={["STUDENT", "ADMIN", "SUPERADMIN"]}>
			<StudentDashboard />
		</ProtectedRoute>
	);
}

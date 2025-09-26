"use client";

import React, { useEffect, useState } from "react";
import MetricsCards from "@/components/dashboard/metrics-cards";
import PerformanceChart from "@/components/dashboard/performance-chart";
import ClassOverview from "@/components/dashboard/class-overview";
import { BookOpen, Calendar, User } from "lucide-react";
import { DashboardMetrics } from "@/types";
import ProtectedRoute from "@/components/ProtectedRoute";
import { chartData, courseAnalytics, skillAnalytics } from "@/lib/mock-data";

interface StudentData {
	studentName: string;
	registrationNo: string;
	rollNo: string;
	batchName: string;
	academicSession: string;
	class: string;
	studentStatus: string;
}

function StudentDashboard() {
	const [studentData, setStudentData] = useState<StudentData | null>(null);
	const [loading, setLoading] = useState(true);

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

		fetchStudentData();
	}, []);

	// Create student-specific metrics
	const studentMetrics: DashboardMetrics = {
		totalStudents: 1,
		totalStudentsChange: 0,
		activeAssessments: 3,
		activeAssessmentsChange: 15.7,
		completedAssessments: 7,
		completedAssessmentsChange: 23.1,
		averageOverallScore: 82.5,
		averageOverallScoreChange: 8.3,
		placementRecommendationRate: 85,
		placementRecommendationRateChange: 12.1,
	};

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

			{/* Metrics Cards */}
			<MetricsCards metrics={studentMetrics} />

			{/* Charts and Course Overview */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
					<PerformanceChart data={chartData} />
				</div>
				<div className="lg:col-span-1">
					<ClassOverview
						courses={courseAnalytics}
						skills={skillAnalytics}
					/>
				</div>
			</div>

			{/* Personal Performance Table - showing only current student */}
			<div className="bg-white p-6 rounded-lg shadow">
				<h2 className="text-xl font-semibold text-gray-900 mb-4">
					Your Performance History
				</h2>
				<div className="text-center py-8">
					<BookOpen className="mx-auto h-12 w-12 text-gray-400" />
					<h3 className="mt-2 text-sm font-medium text-gray-900">
						No assessments completed
					</h3>
					<p className="mt-1 text-sm text-gray-500">
						Complete your first assessment to see your performance history.
					</p>
				</div>
			</div>

			{/* Quick Links */}
			<div className="bg-white p-6 rounded-lg shadow">
				<h2 className="text-xl font-semibold text-gray-900 mb-4">
					Quick Access
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					<a
						href="/student/profile"
						className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
						<div className="flex items-center">
							<User className="h-5 w-5 text-blue-600 mr-3" />
							<span className="font-medium">My Profile</span>
						</div>
						<p className="text-sm text-gray-600 mt-1">
							View and edit your profile
						</p>
					</a>

					<a
						href="/student/courses"
						className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
						<div className="flex items-center">
							<BookOpen className="h-5 w-5 text-green-600 mr-3" />
							<span className="font-medium">My Courses</span>
						</div>
						<p className="text-sm text-gray-600 mt-1">View enrolled courses</p>
					</a>

					<a
						href="/student/attendance"
						className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
						<div className="flex items-center">
							<Calendar className="h-5 w-5 text-orange-600 mr-3" />
							<span className="font-medium">Attendance</span>
						</div>
						<p className="text-sm text-gray-600 mt-1">
							Check attendance records
						</p>
					</a>
				</div>
			</div>

			{/* Announcements */}
			<div className="bg-white p-6 rounded-lg shadow">
				<h2 className="text-xl font-semibold text-gray-900 mb-4">
					Recent Announcements
				</h2>
				<div className="space-y-3">
					<div className="p-3 bg-blue-50 rounded-lg">
						<p className="font-medium text-blue-900">
							Welcome to the New Academic Session
						</p>
						<p className="text-sm text-blue-700 mt-1">
							The new academic session has begun. Please check your course
							enrollment.
						</p>
						<p className="text-xs text-blue-600 mt-2">
							{new Date().toLocaleDateString()}
						</p>
					</div>
					<div className="p-3 bg-green-50 rounded-lg">
						<p className="font-medium text-green-900">System Update Complete</p>
						<p className="text-sm text-green-700 mt-1">
							The student portal has been updated with new features.
						</p>
						<p className="text-xs text-green-600 mt-2">
							{new Date().toLocaleDateString()}
						</p>
					</div>
				</div>
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

"use client";

import React, { useEffect, useState } from "react";
import MetricsCards from "@/components/dashboard/metrics-cards";
import StudentTable from "@/components/dashboard/student-table";
import { GraduationCap, Users } from "lucide-react";
import { AnalyticsMetrics, DashboardMetrics } from "@/types";
import ProtectedRoute from "@/components/ProtectedRoute";
import { User } from "@/models/User";

function AdminDashboard() {
	const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
	const [students, setStudents] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch analytics data
				const analyticsResponse = await fetch(
					`/api/analytics?cacheBust=${new Date().getTime()}`
				);
				if (analyticsResponse.ok) {
					const analyticsData = await analyticsResponse.json();
					setMetrics(analyticsData.metrics);
				} else {
					console.error("Failed to fetch analytics data");
				}

				// Fetch students data
				const studentsResponse = await fetch("/api/students/list?limit=1000");
				if (studentsResponse.ok) {
					const studentsData = await studentsResponse.json();
					setStudents(studentsData.students || []);
				} else {
					console.error("Failed to fetch students data");
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	// Create admin-specific metrics based on fetched stats
	const adminMetrics: DashboardMetrics = {
		totalStudents: students.length,
		totalStudentsChange: metrics?.totalStudentsChange ?? 0,
		activeAssessments: metrics?.totalAssigned ?? 0,
		activeAssessmentsChange: metrics?.activeAssessmentsChange ?? 0,
		completedAssessments: metrics?.totalCompleted ?? 0,
		completedAssessmentsChange: metrics?.completedAssessmentsChange ?? 0,
		averageOverallScore: metrics?.overallAverageScore ?? 0,
		averageOverallScoreChange: metrics?.averageOverallScoreChange ?? 0,
		placementRecommendationRate: metrics?.placementRecommendationRate ?? 0,
		placementRecommendationRateChange:
			metrics?.placementRecommendationRateChange ?? 0,
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-lg">Loading dashboard...</div>
			</div>
		);
	}

	return (
		<div className="w-full space-y-4 sm:space-y-6">
			{/* Page Header */}
			<div className="mb-6 sm:mb-8">
				<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
					Administrator Dashboard
				</h1>
				<p className="text-sm sm:text-base text-gray-600">
					Manage students and monitor academic activities across the institution
				</p>
			</div>

			{/* Metrics Cards */}
			<MetricsCards metrics={adminMetrics} />

			{/* Charts and Course Overview */}
			{/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
					<PerformanceChart data={chartData} />
				</div>
				<div className="lg:col-span-1">
					<ClassOverview
						courses={courseAnalytics}
						skills={skillAnalytics}
					/>
				</div>
			</div> */}

			{/* Student Table */}
			<StudentTable students={students} />

			{/* Quick Actions */}
			<div className="bg-white p-6 rounded-lg shadow">
				<h2 className="text-xl font-semibold text-gray-900 mb-4">
					Quick Actions
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<a
						href="/admin/create-student"
						className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
						<div className="flex items-center">
							<GraduationCap className="h-5 w-5 text-green-600 mr-3" />
							<span className="font-medium">Add New Student</span>
						</div>
						<p className="text-sm text-gray-600 mt-1">
							Register a new student in the system
						</p>
					</a>

					<a
						href="/admin/manage-students"
						className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
						<div className="flex items-center">
							<Users className="h-5 w-5 text-blue-600 mr-3" />
							<span className="font-medium">Manage Students</span>
						</div>
						<p className="text-sm text-gray-600 mt-1">
							View and manage student records
						</p>
					</a>
				</div>
			</div>
		</div>
	);
}

export default function ProtectedAdminDashboard() {
	return (
		<ProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN"]}>
			<AdminDashboard />
		</ProtectedRoute>
	);
}

"use client";

import React, { useEffect, useState } from "react";
import MetricsCards from "@/components/dashboard/metrics-cards";
import PerformanceChart from "@/components/dashboard/performance-chart";
import StudentTable from "@/components/dashboard/student-table";
import ClassOverview from "@/components/dashboard/class-overview";
import { GraduationCap, Users } from "lucide-react";
import { DashboardMetrics } from "@/types";
import ProtectedRoute from "@/components/ProtectedRoute";
import { User } from "@/models/User";
import { chartData, courseAnalytics, skillAnalytics } from "@/lib/mock-data";

interface DashboardStats {
	totalStudents: number;
	activeStudents: number;
}

function AdminDashboard() {
	const [stats, setStats] = useState<DashboardStats>({
		totalStudents: 0,
		activeStudents: 0,
	});
	const [students, setStudents] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const response = await fetch("/api/students/list?limit=1000");
				if (response.ok) {
					const data = await response.json();
					// Set the actual students data
					setStudents(data.students || []);

					const activeStudents =
						data.students?.filter(
							(student: { role: string }) => student.role === "STUDENT"
						) || [];

					setStats({
						totalStudents: data.students?.length || 0,
						activeStudents: activeStudents.length,
					});
				}
			} catch (error) {
				console.error("Error fetching stats:", error);
				// Set empty array on error
				setStudents([]);
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, []);

	// Create admin-specific metrics based on fetched stats
	const adminMetrics: DashboardMetrics = {
		totalStudents: stats.totalStudents,
		totalStudentsChange: 8.3,
		activeAssessments: Math.floor(stats.activeStudents * 0.8),
		activeAssessmentsChange: 15.7,
		completedAssessments: Math.floor(stats.activeStudents * 0.6),
		completedAssessmentsChange: 23.1,
		averageOverallScore: 0,
		averageOverallScoreChange: 4.2,
		placementRecommendationRate:
			stats.totalStudents > 0
				? Math.round((stats.activeStudents / stats.totalStudents) * 100)
				: 0,
		placementRecommendationRateChange: 6.9,
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
					Administrator Dashboard
				</h1>
				<p className="text-gray-600">
					Manage students and monitor academic activities across the institution
				</p>
			</div>

			{/* Metrics Cards */}
			<MetricsCards metrics={adminMetrics} />

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

"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import MetricsCards from "@/components/dashboard/metrics-cards";
import StudentTable from "@/components/dashboard/student-table";
import { Users, GraduationCap, Shield, Activity } from "lucide-react";
import { AnalyticsMetrics, DashboardMetrics } from "@/types";
import { User } from "@/models/User";

interface DashboardStats {
	totalStudents: number;
	totalAdmins: number;
	activeStudents: number;
	totalUsers: number;
}

function SuperAdminDashboard() {
	const [stats, setStats] = useState<DashboardStats>({
		totalStudents: 0,
		totalAdmins: 0,
		activeStudents: 0,
		totalUsers: 0,
	});
	const [analytics, setAnalytics] = useState<AnalyticsMetrics | null>(null);
	const [students, setStudents] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				// Fetch users, students, and analytics data in parallel
				const [usersResponse, studentsResponse, analyticsResponse] = await Promise.all([
					fetch("/api/users/list?limit=1000"),
					fetch("/api/students/list?limit=1000"),
					fetch("/api/analytics"),
				]);

				if (usersResponse.ok && studentsResponse.ok && analyticsResponse.ok) {
					const usersData = await usersResponse.json();
					const studentsData = await studentsResponse.json();
					const analyticsData = await analyticsResponse.json();

					// Process users data
					const admins = usersData.users.filter(
						(user: { role: string }) => user.role === "ADMIN"
					);
					const studentUsers = usersData.users.filter(
						(user: { role: string }) => user.role === "STUDENT"
					);

					// Process students data
					const activeStudents =
						studentsData.students?.filter(
							(student: { studentStatus: string }) =>
								student.studentStatus === "Active"
						) || [];

					// Set the student users for the table
					setStudents(studentUsers || []);

					// Set the dashboard stats
					setStats({
						totalStudents: studentUsers.length,
						totalAdmins: admins.length,
						activeStudents: activeStudents.length,
						totalUsers: usersData.users.length,
					});

					// Set analytics data
					setAnalytics(analyticsData.metrics);
				}
			} catch (error) {
				console.error("Error fetching stats:", error);
				setStudents([]);
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, []);

	// Create superadmin-specific metrics
	const superAdminMetrics: DashboardMetrics = {
		totalStudents: stats.totalStudents,
		totalStudentsChange: analytics?.totalStudentsChange || 0,
		activeAssessments: analytics?.totalAssessments || 0,
		activeAssessmentsChange: analytics?.activeAssessmentsChange || 0,
		completedAssessments: analytics?.totalCompleted || 0,
		completedAssessmentsChange: analytics?.completedAssessmentsChange || 0,
		averageOverallScore: analytics?.overallAverageScore || 0,
		averageOverallScoreChange: analytics?.averageOverallScoreChange || 0,
		placementRecommendationRate: analytics?.placementRecommendationRate || 0,
		placementRecommendationRateChange: analytics?.placementRecommendationRateChange || 0,
	};

	if (loading) {
		return (
			<div className="flex h-screen bg-gray-50">
				<div className="flex-1 flex flex-col overflow-hidden">
					<main className="flex-1 overflow-y-auto p-6">
						<div className="flex items-center justify-center h-64">
							<div className="text-lg">Loading dashboard...</div>
						</div>
					</main>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-screen bg-gray-50">
			{/* Main Content */}
			<div className="flex-1 flex flex-col overflow-hidden">
				<main className="flex-1 overflow-y-auto p-6">
					<div className="max-w-7xl mx-auto space-y-6">
						{/* Additional Stats Cards */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
							<div className="bg-white p-6 rounded-lg shadow">
								<div className="flex items-center">
									<div className="p-3 rounded-full bg-blue-100">
										<Users className="h-6 w-6 text-blue-600" />
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-600">
											Total Users
										</p>
										<p className="text-2xl font-bold text-gray-900">
											{stats.totalUsers}
										</p>
									</div>
								</div>
							</div>

							<div className="bg-white p-6 rounded-lg shadow">
								<div className="flex items-center">
									<div className="p-3 rounded-full bg-green-100">
										<GraduationCap className="h-6 w-6 text-green-600" />
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-600">
											Total Students
										</p>
										<p className="text-2xl font-bold text-gray-900">
											{stats.totalStudents}
										</p>
									</div>
								</div>
							</div>

							<div className="bg-white p-6 rounded-lg shadow">
								<div className="flex items-center">
									<div className="p-3 rounded-full bg-purple-100">
										<Shield className="h-6 w-6 text-purple-600" />
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-600">
											Total Admins
										</p>
										<p className="text-2xl font-bold text-gray-900">
											{stats.totalAdmins}
										</p>
									</div>
								</div>
							</div>

							<div className="bg-white p-6 rounded-lg shadow">
								<div className="flex items-center">
									<div className="p-3 rounded-full bg-orange-100">
										<Activity className="h-6 w-6 text-orange-600" />
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-600">
											Active Students
										</p>
										<p className="text-2xl font-bold text-gray-900">
											{stats.activeStudents}
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Metrics Cards */}
						<MetricsCards metrics={superAdminMetrics} />

						{/* Student Table */}
						<StudentTable students={students} />

						{/* Quick Actions */}
						<div className="bg-white p-6 rounded-lg shadow">
							<h2 className="text-xl font-semibold text-gray-900 mb-4">
								Quick Actions
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								<a
									href="/superadmin/create-admin"
									className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
									<div className="flex items-center">
										<Shield className="h-5 w-5 text-purple-600 mr-3" />
										<span className="font-medium">Create Admin</span>
									</div>
									<p className="text-sm text-gray-600 mt-1">
										Add a new administrator
									</p>
								</a>

								<a
									href="/superadmin/create-student"
									className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
									<div className="flex items-center">
										<GraduationCap className="h-5 w-5 text-green-600 mr-3" />
										<span className="font-medium">Create Student</span>
									</div>
									<p className="text-sm text-gray-600 mt-1">
										Add a new student
									</p>
								</a>

								<a
									href="/superadmin/manage-admins"
									className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
									<div className="flex items-center">
										<Users className="h-5 w-5 text-blue-600 mr-3" />
										<span className="font-medium">Manage Admins</span>
									</div>
									<p className="text-sm text-gray-600 mt-1">
										View and manage administrators
									</p>
								</a>
							</div>
						</div>

						{/* System Status */}
						<div className="bg-white p-6 rounded-lg shadow">
							<h2 className="text-xl font-semibold text-gray-900 mb-4">
								System Status
							</h2>
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-gray-600">Database Connection</span>
									<span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
										Connected
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-gray-600">Authentication Service</span>
									<span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
										Active
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-gray-600">Last System Update</span>
									<span className="text-gray-900">
										{new Date().toLocaleDateString()}
									</span>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}

export default function ProtectedSuperAdminDashboard() {
	return (
		<ProtectedRoute allowedRoles={["SUPERADMIN"]}>
			<SuperAdminDashboard />
		</ProtectedRoute>
	);
}

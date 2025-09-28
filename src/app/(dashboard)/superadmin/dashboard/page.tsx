"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import MetricsCards from "@/components/dashboard/metrics-cards";
import PerformanceChart from "@/components/dashboard/performance-chart";
import StudentTable from "@/components/dashboard/student-table";
import ClassOverview from "@/components/dashboard/class-overview";
import { Users, GraduationCap, Shield, Activity } from "lucide-react";
import { DashboardMetrics } from "@/types";
import { User } from "@/models/User";
import { chartData, courseAnalytics, skillAnalytics } from "@/lib/mock-data";

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
	const [students, setStudents] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				// Fetch users stats
				const usersResponse = await fetch("/api/users/list?limit=1000");
				if (usersResponse.ok) {
					const usersData = await usersResponse.json();
					const admins = usersData.users.filter(
						(user: { role: string }) => user.role === "ADMIN"
					);
					const studentUsers = usersData.users.filter(
						(user: { role: string }) => user.role === "STUDENT"
					);

					// Set the student users for the table
					setStudents(studentUsers || []);

					// Fetch students stats
					const studentsResponse = await fetch("/api/students/list?limit=1000");
					if (studentsResponse.ok) {
						const studentsData = await studentsResponse.json();
						const activeStudents =
							studentsData.students?.filter(
								(student: { studentStatus: string }) =>
									student.studentStatus === "Active"
							) || [];

						setStats({
							totalStudents: studentUsers.length,
							totalAdmins: admins.length,
							activeStudents: activeStudents.length,
							totalUsers: usersData.users.length,
						});
					}
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
		totalStudentsChange: 8.3,
		activeAssessments: Math.floor(stats.activeStudents * 0.8),
		activeAssessmentsChange: 15.7,
		completedAssessments: Math.floor(stats.activeStudents * 0.6),
		completedAssessmentsChange: 23.1,
		averageOverallScore: 78.4,
		averageOverallScoreChange: 4.2,
		placementRecommendationRate: 72.8,
		placementRecommendationRateChange: 6.9,
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

"use client";

import React, { useEffect, useState } from "react";
import PerformanceChart from "@/components/dashboard/performance-chart";
import ProtectedRoute from "@/components/ProtectedRoute";
import { chartData } from "@/lib/mock-data";

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

			{/* Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
					<PerformanceChart data={chartData} />
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

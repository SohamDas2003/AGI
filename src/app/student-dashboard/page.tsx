"use client";

import React from "react";
import { useRouter } from "next/navigation";
import StudentSidebar from "@/components/dashboard/student-sidebar";
import Header from "@/components/dashboard/header";
import {
	Target,
	Clock,
	Award,
	CheckCircle,
	AlertCircle,
	BarChart3,
} from "lucide-react";

// Mock student data
const studentData = {
	name: "John Smith",
	studentId: "MCA24001",
	course: "MCA",
	batch: "2024-26",
	email: "john.smith@student.agi.edu.in",
};

const assessmentStats = {
	total: 5,
	completed: 3,
	pending: 2,
	averageScore: 78.5,
	placementReadiness: "Good",
};

const recentAssessments = [
	{
		id: 1,
		title: "Communication Skills Assessment",
		status: "completed" as const,
		score: 85,
		completedDate: "2025-09-01",
		category: "Communication",
	},
	{
		id: 2,
		title: "Technical Skills Evaluation",
		status: "completed" as const,
		score: 78,
		completedDate: "2025-08-28",
		category: "Domain Skills",
	},
	{
		id: 3,
		title: "Digital Literacy Test",
		status: "completed" as const,
		score: 82,
		completedDate: "2025-08-25",
		category: "Digital Skills",
	},
	{
		id: 4,
		title: "Problem Solving Assessment",
		status: "pending" as const,
		dueDate: "2025-09-10",
		category: "Problem Solving",
	},
	{
		id: 5,
		title: "Interpersonal Skills Evaluation",
		status: "pending" as const,
		dueDate: "2025-09-15",
		category: "Interpersonal",
	},
];

const skillProgress = [
	{ skill: "Domain Skills", score: 78, color: "bg-blue-500" },
	{ skill: "Communication", score: 85, color: "bg-green-500" },
	{ skill: "Digital Skills", score: 82, color: "bg-purple-500" },
	{ skill: "Interpersonal", score: 0, color: "bg-yellow-500" },
	{ skill: "Problem Solving", score: 0, color: "bg-red-500" },
];

export default function StudentDashboard() {
	const router = useRouter();

	const handleStartAssessment = (assessmentId: number) => {
		router.push(`/student-dashboard/assessments/take?id=${assessmentId}`);
	};

	const handleViewAllAssessments = () => {
		router.push("/student-dashboard/assessments");
	};

	return (
		<div className="flex h-screen bg-gray-50">
			{/* Sidebar */}
			<StudentSidebar />

			{/* Main Content */}
			<div className="flex-1 flex flex-col overflow-hidden">
				<Header />

				<main className="flex-1 overflow-y-auto p-6">
					<div className="max-w-7xl mx-auto space-y-6">
						{/* Welcome Header */}
						<div className="mb-8">
							<h1 className="text-3xl font-bold text-gray-900 mb-2">
								Welcome back, {studentData.name}!
							</h1>
							<p className="text-gray-600">
								Track your assessment progress and placement readiness
							</p>
							<div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
								<span>{studentData.studentId}</span>
								<span>•</span>
								<span>
									{studentData.course} - {studentData.batch}
								</span>
							</div>
						</div>

						{/* Stats Cards */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							<div className="bg-white rounded-lg shadow p-6">
								<div className="flex items-center">
									<div className="flex-shrink-0">
										<Target className="w-8 h-8 text-blue-600" />
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-600">
											Total Assessments
										</p>
										<p className="text-2xl font-bold text-gray-900">
											{assessmentStats.total}
										</p>
									</div>
								</div>
							</div>

							<div className="bg-white rounded-lg shadow p-6">
								<div className="flex items-center">
									<div className="flex-shrink-0">
										<CheckCircle className="w-8 h-8 text-green-600" />
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-600">
											Completed
										</p>
										<p className="text-2xl font-bold text-gray-900">
											{assessmentStats.completed}
										</p>
									</div>
								</div>
							</div>

							<div className="bg-white rounded-lg shadow p-6">
								<div className="flex items-center">
									<div className="flex-shrink-0">
										<Clock className="w-8 h-8 text-orange-600" />
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-600">Pending</p>
										<p className="text-2xl font-bold text-gray-900">
											{assessmentStats.pending}
										</p>
									</div>
								</div>
							</div>

							<div className="bg-white rounded-lg shadow p-6">
								<div className="flex items-center">
									<div className="flex-shrink-0">
										<BarChart3 className="w-8 h-8 text-purple-600" />
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-600">
											Average Score
										</p>
										<p className="text-2xl font-bold text-gray-900">
											{assessmentStats.averageScore}%
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Main Content Grid */}
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							{/* Recent Assessments */}
							<div className="lg:col-span-2 bg-white rounded-lg shadow">
								<div className="p-6 border-b border-gray-200 flex justify-between items-center">
									<h3 className="text-lg font-medium text-gray-900">
										Recent Assessments
									</h3>
									<button
										onClick={handleViewAllAssessments}
										className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200">
										View All
									</button>
								</div>
								<div className="divide-y divide-gray-200">
									{recentAssessments.map((assessment) => (
										<div
											key={assessment.id}
											className="p-6 hover:bg-gray-50">
											<div className="flex items-center justify-between">
												<div className="flex-1">
													<h4 className="text-sm font-medium text-gray-900">
														{assessment.title}
													</h4>
													<p className="text-sm text-gray-600 mt-1">
														{assessment.category}
													</p>
													{assessment.status === "completed" ? (
														<p className="text-sm text-gray-500 mt-1">
															Completed on{" "}
															{assessment.completedDate &&
																new Date(
																	assessment.completedDate
																).toLocaleDateString()}
														</p>
													) : (
														<p className="text-sm text-orange-600 mt-1">
															Due:{" "}
															{assessment.dueDate &&
																new Date(
																	assessment.dueDate
																).toLocaleDateString()}
														</p>
													)}
												</div>
												<div className="flex items-center space-x-4">
													{assessment.status === "completed" ? (
														<>
															<div className="text-right">
																<div className="text-sm font-medium text-gray-900">
																	{assessment.score}%
																</div>
																<div className="text-xs text-gray-500">
																	Score
																</div>
															</div>
															<CheckCircle className="w-5 h-5 text-green-500" />
														</>
													) : (
														<>
															<AlertCircle className="w-5 h-5 text-orange-500" />
															<button
																onClick={() =>
																	handleStartAssessment(assessment.id)
																}
																className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors duration-200">
																Start
															</button>
														</>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Skill Progress */}
							<div className="bg-white rounded-lg shadow">
								<div className="p-6 border-b border-gray-200">
									<h3 className="text-lg font-medium text-gray-900">
										Skill Progress
									</h3>
								</div>
								<div className="p-6 space-y-4">
									{skillProgress.map((skill) => (
										<div key={skill.skill}>
											<div className="flex justify-between text-sm mb-1">
												<span className="font-medium text-gray-700">
													{skill.skill}
												</span>
												<span className="text-gray-600">
													{skill.score > 0 ? `${skill.score}%` : "Not taken"}
												</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-2">
												<div
													className={`h-2 rounded-full ${skill.color}`}
													style={{ width: `${skill.score}%` }}></div>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>

						{/* Placement Readiness */}
						<div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 p-6">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-4">
									<Award className="w-8 h-8 text-green-600" />
									<div>
										<h3 className="text-lg font-medium text-green-900">
											Placement Readiness Status
										</h3>
										<p className="text-green-700">
											Based on your current assessment scores
										</p>
									</div>
								</div>
								<div className="text-right">
									<div className="text-2xl font-bold text-green-900">
										{assessmentStats.placementReadiness}
									</div>
									<div className="text-sm text-green-600">
										{assessmentStats.averageScore}% Overall
									</div>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}

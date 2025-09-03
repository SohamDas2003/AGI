"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import StudentSidebar from "@/components/dashboard/student-sidebar";
import Header from "@/components/dashboard/header";
import {
	Play,
	Clock,
	CheckCircle,
	BarChart3,
	Filter,
	Search,
	Target,
} from "lucide-react";

interface StudentAssessment {
	id: number;
	title: string;
	description: string;
	category: string;
	status: "completed" | "pending" | "in_progress";
	score?: number;
	totalQuestions: number;
	duration: number; // in minutes
	completedDate?: string;
	dueDate?: string;
	attempts: number;
	maxAttempts: number;
}

const mockAssessments: StudentAssessment[] = [
	{
		id: 1,
		title: "Communication Skills Assessment",
		description: "Evaluate your verbal and written communication abilities",
		category: "Communication Skills",
		status: "completed",
		score: 85,
		totalQuestions: 10,
		duration: 30,
		completedDate: "2025-09-01",
		attempts: 1,
		maxAttempts: 2,
	},
	{
		id: 2,
		title: "Technical Skills Evaluation",
		description: "Test your domain-specific technical knowledge",
		category: "Domain Skills",
		status: "completed",
		score: 78,
		totalQuestions: 10,
		duration: 45,
		completedDate: "2025-08-28",
		attempts: 1,
		maxAttempts: 2,
	},
	{
		id: 3,
		title: "Digital Literacy Test",
		description: "Assess your digital skills and technology proficiency",
		category: "Digital Skills",
		status: "completed",
		score: 82,
		totalQuestions: 10,
		duration: 30,
		completedDate: "2025-08-25",
		attempts: 1,
		maxAttempts: 2,
	},
	{
		id: 4,
		title: "Problem Solving Assessment",
		description: "Evaluate your analytical and critical thinking abilities",
		category: "Problem Solving",
		status: "pending",
		totalQuestions: 10,
		duration: 40,
		dueDate: "2025-09-10",
		attempts: 0,
		maxAttempts: 2,
	},
	{
		id: 5,
		title: "Interpersonal Skills Evaluation",
		description: "Assess your social and relationship building skills",
		category: "Interpersonal Skills",
		status: "pending",
		totalQuestions: 10,
		duration: 35,
		dueDate: "2025-09-15",
		attempts: 0,
		maxAttempts: 2,
	},
];

const getStatusColor = (status: string) => {
	switch (status) {
		case "completed":
			return "bg-green-100 text-green-800";
		case "pending":
			return "bg-yellow-100 text-yellow-800";
		case "in_progress":
			return "bg-blue-100 text-blue-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
};

const getScoreColor = (score: number) => {
	if (score >= 80) return "text-green-600";
	if (score >= 60) return "text-yellow-600";
	return "text-red-600";
};

export default function StudentAssessments() {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState("all");

	const filteredAssessments = mockAssessments.filter((assessment) => {
		const matchesSearch =
			assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			assessment.category.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesFilter =
			filterStatus === "all" || assessment.status === filterStatus;
		return matchesSearch && matchesFilter;
	});

	const handleStartAssessment = (assessmentId: number) => {
		// Navigate to assessment taking interface
		router.push(`/student-dashboard/assessments/take?id=${assessmentId}`);
	};

	const handleViewResults = (assessmentId: number) => {
		// Navigate to detailed results
		console.log("Viewing results for:", assessmentId);
		alert("Detailed results would be shown here");
	};

	return (
		<div className="flex h-screen bg-gray-50">
			<StudentSidebar />
			<div className="flex-1 flex flex-col overflow-hidden">
				<Header />
				<main className="flex-1 overflow-y-auto p-6">
					<div className="max-w-7xl mx-auto space-y-6">
						{/* Header */}
						<div className="flex justify-between items-center">
							<div>
								<h1 className="text-3xl font-bold text-gray-900">
									My Assessments
								</h1>
								<p className="text-gray-600 mt-1">
									Complete your placement readiness assessments
								</p>
							</div>
						</div>

						{/* Stats Overview */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
							<div className="bg-white rounded-lg p-4 border border-gray-200">
								<div className="flex items-center">
									<Target className="w-8 h-8 text-blue-600" />
									<div className="ml-3">
										<p className="text-sm font-medium text-gray-600">Total</p>
										<p className="text-2xl font-bold text-gray-900">
											{mockAssessments.length}
										</p>
									</div>
								</div>
							</div>
							<div className="bg-white rounded-lg p-4 border border-gray-200">
								<div className="flex items-center">
									<CheckCircle className="w-8 h-8 text-green-600" />
									<div className="ml-3">
										<p className="text-sm font-medium text-gray-600">
											Completed
										</p>
										<p className="text-2xl font-bold text-gray-900">
											{
												mockAssessments.filter((a) => a.status === "completed")
													.length
											}
										</p>
									</div>
								</div>
							</div>
							<div className="bg-white rounded-lg p-4 border border-gray-200">
								<div className="flex items-center">
									<Clock className="w-8 h-8 text-orange-600" />
									<div className="ml-3">
										<p className="text-sm font-medium text-gray-600">Pending</p>
										<p className="text-2xl font-bold text-gray-900">
											{
												mockAssessments.filter((a) => a.status === "pending")
													.length
											}
										</p>
									</div>
								</div>
							</div>
							<div className="bg-white rounded-lg p-4 border border-gray-200">
								<div className="flex items-center">
									<BarChart3 className="w-8 h-8 text-purple-600" />
									<div className="ml-3">
										<p className="text-sm font-medium text-gray-600">
											Avg Score
										</p>
										<p className="text-2xl font-bold text-gray-900">
											{Math.round(
												mockAssessments
													.filter((a) => a.score !== undefined)
													.reduce((sum, a) => sum + (a.score || 0), 0) /
													mockAssessments.filter((a) => a.score !== undefined)
														.length
											)}
											%
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Filters */}
						<div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg border border-gray-200">
							<div className="flex-1">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
									<input
										type="text"
										placeholder="Search assessments..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
									/>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Filter className="w-4 h-4 text-gray-400" />
								<select
									value={filterStatus}
									onChange={(e) => setFilterStatus(e.target.value)}
									className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
									<option value="all">All Status</option>
									<option value="pending">Pending</option>
									<option value="in_progress">In Progress</option>
									<option value="completed">Completed</option>
								</select>
							</div>
						</div>

						{/* Assessments Grid */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{filteredAssessments.map((assessment) => (
								<div
									key={assessment.id}
									className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
									<div className="p-6">
										<div className="flex justify-between items-start mb-4">
											<div className="flex-1">
												<h3 className="text-lg font-semibold text-gray-900 mb-2">
													{assessment.title}
												</h3>
												<p className="text-sm text-gray-600 mb-3">
													{assessment.description}
												</p>
												<div className="flex items-center space-x-4 text-sm text-gray-500">
													<span className="flex items-center">
														<Target className="w-4 h-4 mr-1" />
														{assessment.totalQuestions} questions
													</span>
													<span className="flex items-center">
														<Clock className="w-4 h-4 mr-1" />
														{assessment.duration} mins
													</span>
												</div>
											</div>
											<span
												className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
													assessment.status
												)}`}>
												{assessment.status.charAt(0).toUpperCase() +
													assessment.status.slice(1).replace("_", " ")}
											</span>
										</div>

										<div className="border-t border-gray-200 pt-4">
											<div className="flex items-center justify-between">
												<div className="space-y-1">
													<div className="text-sm text-gray-600">
														Category:{" "}
														<span className="font-medium">
															{assessment.category}
														</span>
													</div>
													{assessment.status === "completed" ? (
														<div className="flex items-center space-x-4">
															<div className="text-sm text-gray-600">
																Score:{" "}
																<span
																	className={`font-bold ${getScoreColor(
																		assessment.score || 0
																	)}`}>
																	{assessment.score}%
																</span>
															</div>
															<div className="text-sm text-gray-600">
																Completed:{" "}
																{assessment.completedDate &&
																	new Date(
																		assessment.completedDate
																	).toLocaleDateString()}
															</div>
														</div>
													) : (
														<div className="text-sm text-gray-600">
															Due:{" "}
															{assessment.dueDate &&
																new Date(
																	assessment.dueDate
																).toLocaleDateString()}
														</div>
													)}
													<div className="text-xs text-gray-500">
														Attempts: {assessment.attempts}/
														{assessment.maxAttempts}
													</div>
												</div>
												<div className="flex space-x-2">
													{assessment.status === "completed" ? (
														<button
															onClick={() => handleViewResults(assessment.id)}
															className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">
															<BarChart3 className="w-4 h-4 mr-1" />
															View Results
														</button>
													) : (
														<button
															onClick={() =>
																handleStartAssessment(assessment.id)
															}
															disabled={
																assessment.attempts >= assessment.maxAttempts
															}
															className={`inline-flex items-center px-3 py-2 rounded-lg transition-colors text-sm ${
																assessment.attempts >= assessment.maxAttempts
																	? "bg-gray-100 text-gray-400 cursor-not-allowed"
																	: "bg-green-600 text-white hover:bg-green-700"
															}`}>
															<Play className="w-4 h-4 mr-1" />
															{assessment.status === "in_progress"
																? "Continue"
																: "Start"}
														</button>
													)}
													{assessment.status === "completed" &&
														assessment.attempts < assessment.maxAttempts && (
															<button
																onClick={() =>
																	handleStartAssessment(assessment.id)
																}
																className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
																<Play className="w-4 h-4 mr-1" />
																Retake
															</button>
														)}
												</div>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>

						{filteredAssessments.length === 0 && (
							<div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
								<div className="text-gray-500">
									<Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
									<h3 className="text-lg font-medium mb-2">
										No assessments found
									</h3>
									<p>No assessments match your current search criteria.</p>
								</div>
							</div>
						)}
					</div>
				</main>
			</div>
		</div>
	);
}

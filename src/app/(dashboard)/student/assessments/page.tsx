"use client";

import React, { useState, useEffect } from "react";
import {
	Clock,
	Users,
	PlayCircle,
	CheckCircle,
	AlertCircle,
	Eye,
	FileText,
	Target,
	Calendar,
	RefreshCw,
} from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

interface AssessmentItem {
	_id: string;
	title: string;
	description: string;
	course: string;
	batch: string;
	timeLimit?: number;
	totalQuestions: number;
	status: "active" | "draft" | "completed";
	instructions?: string;
	dueDate?: string;
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

export default function StudentAssessmentsPage() {
	const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [filter, setFilter] = useState<"all" | "assigned" | "completed">("all");

	useEffect(() => {
		fetchAssessments();
	}, []);

	const fetchAssessments = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await fetch("/api/assessments/student/assigned", {
				credentials: "include", // Include cookies for authentication
			});

			if (!response.ok) {
				if (response.status === 401) {
					setError("Please log in to view your assessments.");
					return;
				} else if (response.status === 404) {
					setError(
						"Student profile not found. Please contact your administrator."
					);
					return;
				} else {
					setError(`Server error: ${response.status}. Please try again later.`);
					return;
				}
			}

			const result = await response.json();

			if (result.success) {
				setAssessments(result.assessments || []);
			} else {
				setError(result.error || "Failed to fetch assessments");
			}
		} catch (error) {
			console.error("Error fetching assessments:", error);
			setError("Network error. Please check your connection and try again.");
		} finally {
			setLoading(false);
		}
	};

	const filteredAssessments = assessments.filter((assessment) => {
		switch (filter) {
			case "assigned":
				return assessment.status === "active" && !assessment.lastAttempt;
			case "completed":
				return !!assessment.lastAttempt;
			default:
				return true;
		}
	});

	const getStatusBadge = (assessment: AssessmentItem) => {
		if (assessment.lastAttempt) {
			return (
				<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
					<CheckCircle className="w-3 h-3 mr-1" />
					Completed
				</span>
			);
		}

		if (assessment.status === "active") {
			return (
				<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
					<PlayCircle className="w-3 h-3 mr-1" />
					Available
				</span>
			);
		}

		return (
			<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
				<AlertCircle className="w-3 h-3 mr-1" />
				Not Available
			</span>
		);
	};

	const canTakeAssessment = (assessment: AssessmentItem) => {
		return assessment.status === "active" && assessment.attempts.allowed;
	};

	if (loading) {
		return (
			<ProtectedRoute allowedRoles={["STUDENT"]}>
				<div className="flex items-center justify-center min-h-96">
					<div className="text-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
						<p className="text-gray-600">Loading your assessments...</p>
					</div>
				</div>
			</ProtectedRoute>
		);
	}

	return (
		<ProtectedRoute allowedRoles={["STUDENT"]}>
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
							<Target className="h-8 w-8 text-blue-600" />
							My Assessments
						</h1>
						<p className="text-gray-600 mt-1">
							View and take your assigned assessments
						</p>
					</div>
					<button
						onClick={fetchAssessments}
						className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
						<RefreshCw className="h-4 w-4" />
						Refresh
					</button>
				</div>

				{/* Disclaimer */}
				<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
					<div className="flex items-start gap-3">
						<AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
						<div>
							<h3 className="font-medium text-yellow-800 mb-1">
								Important Disclaimer
							</h3>
							<p className="text-yellow-700 text-sm">
								The purpose of this test is to help students identify their
								strengths and areas of improvement. Results are for guidance
								only and do not guarantee placement outcomes.
							</p>
						</div>
					</div>
				</div>

				{/* Error Display */}
				{error && (
					<div className="bg-red-50 border border-red-200 rounded-lg p-4">
						<div className="flex items-center gap-2">
							<AlertCircle className="h-5 w-5 text-red-600" />
							<span className="text-red-800 font-medium">Error</span>
						</div>
						<p className="text-red-700 mt-1">{error}</p>
						<button
							onClick={fetchAssessments}
							className="mt-3 text-red-600 hover:text-red-800 underline">
							Try again
						</button>
					</div>
				)}

				{/* Filter Tabs */}
				<div className="border-b border-gray-200">
					<nav className="-mb-px flex space-x-8">
						{[
							{
								key: "all",
								label: "All Assessments",
								count: assessments.length,
							},
							{
								key: "assigned",
								label: "Assigned",
								count: assessments.filter(
									(a) => a.status === "active" && !a.lastAttempt
								).length,
							},
							{
								key: "completed",
								label: "Completed",
								count: assessments.filter((a) => !!a.lastAttempt).length,
							},
						].map((tab) => (
							<button
								key={tab.key}
								onClick={() => setFilter(tab.key as typeof filter)}
								className={`py-2 px-1 border-b-2 font-medium text-sm ${
									filter === tab.key
										? "border-blue-500 text-blue-600"
										: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
								}`}>
								{tab.label}
								<span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
									{tab.count}
								</span>
							</button>
						))}
					</nav>
				</div>

				{/* Assessments List */}
				{!error && filteredAssessments.length === 0 ? (
					<div className="text-center py-12">
						<div className="text-gray-400 mb-4">
							<FileText className="w-16 h-16 mx-auto" />
						</div>
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							{filter === "all"
								? "No assessments available"
								: `No ${filter} assessments`}
						</h3>
						<p className="text-gray-600 mb-4">
							{filter === "assigned"
								? "You don't have any pending assessments to complete."
								: filter === "completed"
								? "You haven't completed any assessments yet."
								: "No assessments have been assigned to your course yet."}
						</p>
						<button
							onClick={fetchAssessments}
							className="flex items-center gap-2 mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
							<RefreshCw className="h-4 w-4" />
							Check for new assessments
						</button>
					</div>
				) : (
					<div className="grid gap-6">
						{filteredAssessments.map((assessment) => (
							<div
								key={assessment._id}
								className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="flex items-start justify-between mb-3">
											<div>
												<h3 className="text-xl font-semibold text-gray-900 mb-1">
													{assessment.title}
												</h3>
												<div className="flex items-center space-x-4 text-sm text-gray-600">
													<span className="flex items-center gap-1">
														<Target className="h-3 w-3" />
														<span className="font-medium">
															{assessment.course}
														</span>
													</span>
													{assessment.batch && assessment.batch !== "ALL" && (
														<>
															<span>•</span>
															<span>{assessment.batch}</span>
														</>
													)}
													<span>•</span>
													<span className="flex items-center gap-1">
														<Calendar className="h-3 w-3" />
														Created
													</span>
												</div>
											</div>
											{getStatusBadge(assessment)}
										</div>

										{assessment.description && (
											<p className="text-gray-600 mb-4 line-clamp-2">
												{assessment.description}
											</p>
										)}

										{/* Assessment Info */}
										<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
											<div className="flex items-center text-sm text-gray-600">
												<Users className="w-4 h-4 mr-2" />
												<span>{assessment.totalQuestions} Questions</span>
											</div>
											{assessment.timeLimit && (
												<div className="flex items-center text-sm text-gray-600">
													<Clock className="w-4 h-4 mr-2" />
													<span>{assessment.timeLimit} minutes</span>
												</div>
											)}
											<div className="flex items-center text-sm text-gray-600">
												<span className="font-medium">Attempts:</span>
												<span className="ml-1">
													{assessment.attempts.current} /{" "}
													{assessment.attempts.max}
												</span>
											</div>
											{assessment.lastAttempt &&
												assessment.lastAttempt.score !== undefined && (
													<div className="flex items-center text-sm text-gray-600">
														<span className="font-medium">Score:</span>
														<span className="ml-1">
															{assessment.lastAttempt.score}%
														</span>
													</div>
												)}
										</div>

										{/* Last Attempt Info */}
										{assessment.lastAttempt && (
											<div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
												<p className="text-green-800 text-sm">
													Completed on{" "}
													{new Date(
														assessment.lastAttempt.completedAt
													).toLocaleDateString("en-US", {
														year: "numeric",
														month: "long",
														day: "numeric",
														hour: "2-digit",
														minute: "2-digit",
													})}
												</p>
											</div>
										)}

										{/* Instructions Preview */}
										{assessment.instructions && (
											<div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
												<h4 className="font-medium text-blue-900 mb-1">
													Instructions:
												</h4>
												<p className="text-blue-800 text-sm line-clamp-2">
													{assessment.instructions}
												</p>
											</div>
										)}
									</div>
								</div>

								{/* Action Buttons */}
								<div className="flex items-center justify-between pt-4 border-t border-gray-200">
									<div className="flex space-x-3">
										{canTakeAssessment(assessment) ? (
											<Link
												href={`/student/assessments/${assessment._id}/take`}
												className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
												<PlayCircle className="w-4 h-4 mr-2" />
												{assessment.attempts.current > 0
													? "Retake Assessment"
													: "Start Assessment"}
											</Link>
										) : assessment.lastAttempt ? (
											<Link
												href={`/student/assessments/${assessment._id}/results`}
												className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
												<Eye className="w-4 h-4 mr-2" />
												View Results
											</Link>
										) : (
											<button
												disabled
												className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-medium">
												<AlertCircle className="w-4 h-4 mr-2" />
												Not Available
											</button>
										)}

										<Link
											href={`/student/assessments/${assessment._id}`}
											className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
											<Eye className="w-4 h-4 mr-2" />
											View Details
										</Link>
									</div>

									{assessment.dueDate && (
										<div className="text-sm text-gray-500">
											Due: {new Date(assessment.dueDate).toLocaleDateString()}
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</ProtectedRoute>
	);
}

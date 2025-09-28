"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
	X,
	Users,
	Clock,
	FileText,
	Target,
	CheckCircle,
	PlayCircle,
	Calendar,
	BarChart3,
	Download,
	User,
	Award,
	Timer,
} from "lucide-react";

interface AssessmentAnalytics {
	assessment: {
		_id: string;
		title: string;
		description: string;
		status: string;
		createdAt: string;
		updatedAt: string;
		criteria: {
			course: string[];
		};
		timeLimit: number;
		sections: Array<{
			title: string;
			questions: Array<{
				prompt: string;
				type: string;
			}>;
		}>;
		stats: {
			totalEligibleStudents: number;
			totalAssigned: number;
			totalStarted: number;
			totalCompleted: number;
			completionRate: number;
			averageScore: number;
			averageTimeSpent: number;
		};
	};
	students: Array<{
		_id: string;
		name: string;
		email: string;
		course: string;
		batchName: string;
		status: string;
		score: number | null;
		timeSpent: number | null;
		startedAt: string | null;
		completedAt: string | null;
		lastAttempt: string | null;
	}>;
}

interface AssessmentDetailModalProps {
	assessmentId: string;
	isOpen: boolean;
	onClose: () => void;
}

export default function AssessmentDetailModal({
	assessmentId,
	isOpen,
	onClose,
}: AssessmentDetailModalProps) {
	const [data, setData] = useState<AssessmentAnalytics | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<
		"overview" | "students" | "analytics"
	>("overview");

	const fetchAssessmentDetails = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await fetch(
				`/api/assessments/${assessmentId}/analytics`,
				{
					credentials: "include",
				}
			);

			if (response.ok) {
				const result = await response.json();
				setData(result);
			} else {
				setError("Failed to fetch assessment details");
			}
		} catch (error) {
			console.error("Error fetching assessment details:", error);
			setError("Error loading assessment details");
		} finally {
			setLoading(false);
		}
	}, [assessmentId]);

	useEffect(() => {
		if (isOpen && assessmentId) {
			fetchAssessmentDetails();
		}
	}, [isOpen, assessmentId, fetchAssessmentDetails]);

	const formatDate = (dateString: string | null) => {
		if (!dateString) return "N/A";
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const formatDuration = (minutes: number | null) => {
		if (!minutes) return "N/A";
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
	};

	const getStatusBadge = (status: string) => {
		const statusConfig = {
			completed: { color: "bg-green-100 text-green-800", label: "Completed" },
			in_progress: { color: "bg-blue-100 text-blue-800", label: "In Progress" },
			not_started: { color: "bg-gray-100 text-gray-800", label: "Not Started" },
		};

		const config =
			statusConfig[status as keyof typeof statusConfig] ||
			statusConfig.not_started;
		return (
			<span
				className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
				{config.label}
			</span>
		);
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b">
					<div>
						<h2 className="text-xl font-semibold text-gray-900">
							Assessment Details
						</h2>
						{data && (
							<p className="text-sm text-gray-600 mt-1">
								{data.assessment.title}
							</p>
						)}
					</div>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded">
						<X className="h-5 w-5" />
					</button>
				</div>

				{/* Content */}
				<div className="flex flex-col h-[calc(90vh-80px)]">
					{loading ? (
						<div className="flex-1 flex items-center justify-center">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
						</div>
					) : error ? (
						<div className="flex-1 flex items-center justify-center">
							<div className="text-center">
								<p className="text-red-600 mb-2">{error}</p>
								<button
									onClick={fetchAssessmentDetails}
									className="text-blue-600 hover:text-blue-800">
									Try again
								</button>
							</div>
						</div>
					) : data ? (
						<>
							{/* Tabs */}
							<div className="border-b bg-gray-50">
								<nav className="flex space-x-8 px-6">
									{[
										{ id: "overview", label: "Overview", icon: FileText },
										{ id: "students", label: "Students", icon: Users },
										{ id: "analytics", label: "Analytics", icon: BarChart3 },
									].map((tab) => (
										<button
											key={tab.id}
											onClick={() => setActiveTab(tab.id as typeof activeTab)}
											className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
												activeTab === tab.id
													? "border-blue-500 text-blue-600"
													: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
											}`}>
											<tab.icon className="h-4 w-4" />
											{tab.label}
										</button>
									))}
								</nav>
							</div>

							{/* Tab Content */}
							<div className="flex-1 overflow-y-auto">
								{activeTab === "overview" && (
									<div className="p-6 space-y-6">
										{/* Basic Info */}
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div className="space-y-4">
												<h3 className="text-lg font-medium text-gray-900">
													Basic Information
												</h3>
												<div className="space-y-3">
													<div>
														<label className="text-sm font-medium text-gray-500">
															Title
														</label>
														<p className="text-gray-900">
															{data.assessment.title}
														</p>
													</div>
													<div>
														<label className="text-sm font-medium text-gray-500">
															Description
														</label>
														<p className="text-gray-900">
															{data.assessment.description}
														</p>
													</div>
													<div>
														<label className="text-sm font-medium text-gray-500">
															Status
														</label>
														<div className="mt-1">
															{getStatusBadge(data.assessment.status)}
														</div>
													</div>
													<div>
														<label className="text-sm font-medium text-gray-500">
															Target Courses
														</label>
														<div className="mt-1 flex flex-wrap gap-1">
															{data.assessment.criteria.course.map(
																(course, index) => (
																	<span
																		key={index}
																		className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
																		{course}
																	</span>
																)
															)}
														</div>
													</div>
												</div>
											</div>

											<div className="space-y-4">
												<h3 className="text-lg font-medium text-gray-900">
													Assessment Details
												</h3>
												<div className="space-y-3">
													<div className="flex items-center gap-2">
														<Clock className="h-4 w-4 text-gray-500" />
														<span className="text-sm text-gray-500">
															Time Limit:
														</span>
														<span className="text-gray-900">
															{data.assessment.timeLimit} minutes
														</span>
													</div>
													<div className="flex items-center gap-2">
														<FileText className="h-4 w-4 text-gray-500" />
														<span className="text-sm text-gray-500">
															Sections:
														</span>
														<span className="text-gray-900">
															{data.assessment.sections.length}
														</span>
													</div>
													<div className="flex items-center gap-2">
														<Target className="h-4 w-4 text-gray-500" />
														<span className="text-sm text-gray-500">
															Total Questions:
														</span>
														<span className="text-gray-900">
															{data.assessment.sections.reduce(
																(sum, section) =>
																	sum + section.questions.length,
																0
															)}
														</span>
													</div>
													<div className="flex items-center gap-2">
														<Calendar className="h-4 w-4 text-gray-500" />
														<span className="text-sm text-gray-500">
															Created:
														</span>
														<span className="text-gray-900">
															{formatDate(data.assessment.createdAt)}
														</span>
													</div>
												</div>
											</div>
										</div>

										{/* Sections */}
										<div>
											<h3 className="text-lg font-medium text-gray-900 mb-4">
												Assessment Sections
											</h3>
											<div className="space-y-4">
												{data.assessment.sections.map((section, index) => (
													<div
														key={index}
														className="border rounded-lg p-4">
														<h4 className="font-medium text-gray-900 mb-2">
															Section {index + 1}: {section.title}
														</h4>
														<p className="text-sm text-gray-600">
															{section.questions.length} questions
														</p>
													</div>
												))}
											</div>
										</div>
									</div>
								)}

								{activeTab === "students" && (
									<div className="p-6">
										<div className="flex justify-between items-center mb-4">
											<h3 className="text-lg font-medium text-gray-900">
												Student Assignments
											</h3>
											<button className="text-blue-600 hover:text-blue-800 flex items-center gap-2 text-sm">
												<Download className="h-4 w-4" />
												Export CSV
											</button>
										</div>

										<div className="overflow-x-auto">
											<table className="w-full border border-gray-200 rounded-lg">
												<thead className="bg-gray-50">
													<tr>
														<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
															Student
														</th>
														<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
															Course
														</th>
														<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
															Status
														</th>
														<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
															Score
														</th>
														<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
															Time Spent
														</th>
														<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
															Completed
														</th>
													</tr>
												</thead>
												<tbody className="divide-y divide-gray-200">
													{data.students.map((student) => (
														<tr
															key={student._id}
															className="hover:bg-gray-50">
															<td className="px-4 py-3">
																<div className="flex items-center gap-3">
																	<div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
																		<User className="h-4 w-4 text-gray-500" />
																	</div>
																	<div>
																		<div className="font-medium text-gray-900">
																			{student.name}
																		</div>
																		<div className="text-sm text-gray-500">
																			{student.email}
																		</div>
																	</div>
																</div>
															</td>
															<td className="px-4 py-3">
																<span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
																	{student.course}
																</span>
															</td>
															<td className="px-4 py-3">
																{getStatusBadge(student.status)}
															</td>
															<td className="px-4 py-3">
																{student.score !== null ? (
																	<div className="flex items-center gap-1">
																		<Award className="h-4 w-4 text-yellow-500" />
																		<span className="font-medium">
																			{student.score}%
																		</span>
																	</div>
																) : (
																	<span className="text-gray-400">-</span>
																)}
															</td>
															<td className="px-4 py-3">
																{student.timeSpent ? (
																	<div className="flex items-center gap-1">
																		<Timer className="h-4 w-4 text-gray-500" />
																		<span>
																			{formatDuration(student.timeSpent)}
																		</span>
																	</div>
																) : (
																	<span className="text-gray-400">-</span>
																)}
															</td>
															<td className="px-4 py-3 text-sm text-gray-500">
																{formatDate(student.completedAt)}
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									</div>
								)}

								{activeTab === "analytics" && (
									<div className="p-6 space-y-6">
										{/* Stats Cards */}
										<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
											<div className="bg-blue-50 p-4 rounded-lg">
												<div className="flex items-center gap-2">
													<Users className="h-5 w-5 text-blue-600" />
													<div>
														<p className="text-sm text-blue-600">Assigned</p>
														<p className="text-2xl font-bold text-blue-900">
															{data.assessment.stats.totalAssigned}
														</p>
													</div>
												</div>
											</div>
											<div className="bg-yellow-50 p-4 rounded-lg">
												<div className="flex items-center gap-2">
													<PlayCircle className="h-5 w-5 text-yellow-600" />
													<div>
														<p className="text-sm text-yellow-600">Started</p>
														<p className="text-2xl font-bold text-yellow-900">
															{data.assessment.stats.totalStarted}
														</p>
													</div>
												</div>
											</div>
											<div className="bg-green-50 p-4 rounded-lg">
												<div className="flex items-center gap-2">
													<CheckCircle className="h-5 w-5 text-green-600" />
													<div>
														<p className="text-sm text-green-600">Completed</p>
														<p className="text-2xl font-bold text-green-900">
															{data.assessment.stats.totalCompleted}
														</p>
													</div>
												</div>
											</div>
											<div className="bg-purple-50 p-4 rounded-lg">
												<div className="flex items-center gap-2">
													<BarChart3 className="h-5 w-5 text-purple-600" />
													<div>
														<p className="text-sm text-purple-600">
															Completion Rate
														</p>
														<p className="text-2xl font-bold text-purple-900">
															{data.assessment.stats.completionRate.toFixed(1)}%
														</p>
													</div>
												</div>
											</div>
										</div>

										{/* Additional Analytics */}
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div className="bg-white border rounded-lg p-4">
												<h4 className="font-medium text-gray-900 mb-3">
													Performance Metrics
												</h4>
												<div className="space-y-3">
													<div className="flex justify-between">
														<span className="text-sm text-gray-600">
															Average Score:
														</span>
														<span className="font-medium">
															{data.assessment.stats.averageScore.toFixed(1)}%
														</span>
													</div>
													<div className="flex justify-between">
														<span className="text-sm text-gray-600">
															Average Time:
														</span>
														<span className="font-medium">
															{formatDuration(
																data.assessment.stats.averageTimeSpent
															)}
														</span>
													</div>
													<div className="flex justify-between">
														<span className="text-sm text-gray-600">
															Time Limit:
														</span>
														<span className="font-medium">
															{data.assessment.timeLimit} minutes
														</span>
													</div>
												</div>
											</div>

											<div className="bg-white border rounded-lg p-4">
												<h4 className="font-medium text-gray-900 mb-3">
													Status Distribution
												</h4>
												<div className="space-y-2">
													<div className="flex justify-between items-center">
														<span className="text-sm text-gray-600">
															Not Started:
														</span>
														<span className="font-medium">
															{data.assessment.stats.totalAssigned -
																data.assessment.stats.totalStarted}
														</span>
													</div>
													<div className="flex justify-between items-center">
														<span className="text-sm text-gray-600">
															In Progress:
														</span>
														<span className="font-medium">
															{data.assessment.stats.totalStarted -
																data.assessment.stats.totalCompleted}
														</span>
													</div>
													<div className="flex justify-between items-center">
														<span className="text-sm text-gray-600">
															Completed:
														</span>
														<span className="font-medium">
															{data.assessment.stats.totalCompleted}
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								)}
							</div>
						</>
					) : null}
				</div>
			</div>
		</div>
	);
}

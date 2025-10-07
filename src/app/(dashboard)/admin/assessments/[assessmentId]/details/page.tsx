"use client";

import React, { useEffect, useState } from "react";
import {
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
	ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

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

export default function AssessmentDetailsPage() {
	const params = useParams();
	const assessmentId = params.assessmentId as string;

	const [data, setData] = useState<AssessmentAnalytics | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<
		"overview" | "students" | "sections"
	>("overview");

	useEffect(() => {
		const fetchAssessmentDetails = async () => {
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
		};

		if (assessmentId) {
			fetchAssessmentDetails();
		}
	}, [assessmentId]);

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
			active: { color: "bg-green-100 text-green-800", label: "Active" },
			draft: { color: "bg-yellow-100 text-yellow-800", label: "Draft" },
			archived: { color: "bg-gray-100 text-gray-800", label: "Archived" },
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

	if (loading) {
		return (
			<div className="p-6">
				<div className="flex items-center justify-center min-h-[400px]">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-6">
				<div className="flex items-center justify-center min-h-[400px]">
					<div className="text-center">
						<p className="text-red-600 mb-2">{error}</p>
						<Link
							href="/admin/assessments"
							className="text-blue-600 hover:text-blue-800">
							Back to Assessments
						</Link>
					</div>
				</div>
			</div>
		);
	}

	if (!data) {
		return null;
	}

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Link
						href="/admin/assessments"
						className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
						<ArrowLeft className="h-5 w-5 text-gray-600" />
					</Link>
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							{data.assessment.title}
						</h1>
						<p className="text-sm text-gray-600 mt-1">
							{data.assessment.description}
						</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					{getStatusBadge(data.assessment.status)}
					<Link
						href={`/admin/assessments/${assessmentId}/analytics`}
						className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
						<BarChart3 className="h-4 w-4" />
						View Analytics
					</Link>
				</div>
			</div>

			{/* Quick Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
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
				<div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
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
				<div className="bg-green-50 p-4 rounded-lg border border-green-100">
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
				<div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
					<div className="flex items-center gap-2">
						<BarChart3 className="h-5 w-5 text-purple-600" />
						<div>
							<p className="text-sm text-purple-600">Completion</p>
							<p className="text-2xl font-bold text-purple-900">
								{data.assessment.stats.completionRate.toFixed(1)}%
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Tabs */}
			<div className="bg-white rounded-lg border shadow-sm overflow-hidden">
				<div className="border-b bg-gray-50">
					<nav className="flex space-x-8 px-6">
						{[
							{ id: "overview", label: "Overview", icon: FileText },
							{ id: "students", label: "Students", icon: Users },
							{ id: "sections", label: "Sections", icon: Target },
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
				<div className="p-6">
					{activeTab === "overview" && (
						<div className="space-y-6">
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
											<p className="text-gray-900">{data.assessment.title}</p>
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
											<span className="text-sm text-gray-500">Time Limit:</span>
											<span className="text-gray-900">
												{data.assessment.timeLimit} minutes
											</span>
										</div>
										<div className="flex items-center gap-2">
											<FileText className="h-4 w-4 text-gray-500" />
											<span className="text-sm text-gray-500">Sections:</span>
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
													(sum, section) => sum + section.questions.length,
													0
												)}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<Calendar className="h-4 w-4 text-gray-500" />
											<span className="text-sm text-gray-500">Created:</span>
											<span className="text-gray-900">
												{formatDate(data.assessment.createdAt)}
											</span>
										</div>
									</div>
								</div>
							</div>

							{/* Performance Metrics */}
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
											<span className="font-medium text-gray-900">
												{data.assessment.stats.averageScore.toFixed(1)}%
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-sm text-gray-600">
												Average Time:
											</span>
											<span className="font-medium text-gray-900">
												{formatDuration(data.assessment.stats.averageTimeSpent)}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-sm text-gray-600">
												Completion Rate:
											</span>
											<span className="font-medium text-gray-900">
												{data.assessment.stats.completionRate.toFixed(1)}%
											</span>
										</div>
									</div>
								</div>

								<div className="bg-white border rounded-lg p-4">
									<h4 className="font-medium text-gray-900 mb-3">
										Participation
									</h4>
									<div className="space-y-3">
										<div className="flex justify-between">
											<span className="text-sm text-gray-600">
												Eligible Students:
											</span>
											<span className="font-medium text-gray-900">
												{data.assessment.stats.totalEligibleStudents}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-sm text-gray-600">Assigned:</span>
											<span className="font-medium text-gray-900">
												{data.assessment.stats.totalAssigned}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-sm text-gray-600">Started:</span>
											<span className="font-medium text-gray-900">
												{data.assessment.stats.totalStarted}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-sm text-gray-600">Completed:</span>
											<span className="font-medium text-gray-900">
												{data.assessment.stats.totalCompleted}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === "students" && (
						<div>
							<div className="flex justify-between items-center mb-4">
								<h3 className="text-lg font-medium text-gray-900">
									Student Assignments ({data.students.length})
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
												Batch
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
									<tbody className="divide-y divide-gray-200 bg-white">
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
												<td className="px-4 py-3 text-sm text-gray-900">
													{student.batchName}
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
															<span>{formatDuration(student.timeSpent)}</span>
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
										{data.students.length === 0 && (
											<tr>
												<td
													colSpan={7}
													className="px-4 py-8 text-center text-gray-500">
													No students assigned yet
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{activeTab === "sections" && (
						<div>
							<h3 className="text-lg font-medium text-gray-900 mb-4">
								Assessment Sections ({data.assessment.sections.length})
							</h3>
							<div className="space-y-4">
								{data.assessment.sections.map((section, index) => (
									<div
										key={index}
										className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
										<div className="flex items-start justify-between">
											<div>
												<h4 className="font-medium text-gray-900 mb-2">
													Section {index + 1}: {section.title}
												</h4>
												<p className="text-sm text-gray-600">
													{section.questions.length} questions
												</p>
											</div>
											<span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
												Section {index + 1}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

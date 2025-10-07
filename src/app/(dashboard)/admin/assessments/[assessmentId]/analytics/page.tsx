"use client";

import React, { useState, useEffect } from "react";
import {
	ArrowLeft,
	Users,
	TrendingDown,
	AlertTriangle,
	Award,
	Clock,
	CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface SectionScore {
	sectionId: string;
	sectionTitle: string;
	percentage: number;
	averageRating: number;
	needsAttention: boolean;
}

interface Student {
	_id: string;
	name: string;
	email: string;
	course: string;
	batchName: string;
	status: string;
	overallPercentage: number | null;
	overallAverageRating: number | null;
	timeSpent: number | null;
	completedAt: string | null;
	sectionBreakdown: SectionScore[];
	sectionsNeedingAttention: string[];
	needsAttention: boolean;
}

interface SectionAnalytic {
	sectionId: string;
	sectionTitle: string;
	sectionDescription: string;
	totalQuestions: number;
	responseCount: number;
	averagePercentage: number;
	averageRating: number;
	studentsBelowThreshold: number;
	studentsNeedingAttention: Array<{
		studentId: string;
		studentName: string;
		email: string;
		course: string;
		batchName: string;
		percentage: number;
		averageRating: number;
		questionsAnswered: number;
		totalQuestions: number;
	}>;
}

interface Assessment {
	_id: string;
	title: string;
	description: string;
	stats: {
		totalEligibleStudents: number;
		totalCompleted: number;
		completionRate: number;
		averagePercentage: number;
		averageRating: number;
		averageTimeSpent: number;
	};
}

export default function AssessmentAnalyticsPage() {
	const params = useParams();
	const assessmentId = params.assessmentId as string;

	const [assessment, setAssessment] = useState<Assessment | null>(null);
	const [sectionAnalytics, setSectionAnalytics] = useState<SectionAnalytic[]>(
		[]
	);
	const [sectionsRanked, setSectionsRanked] = useState<SectionAnalytic[]>([]);
	const [studentsNeedingAttention, setStudentsNeedingAttention] = useState<
		Student[]
	>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedSection, setSelectedSection] = useState<string | null>(null);
	const [view, setView] = useState<"overview" | "sections" | "students">(
		"overview"
	);

	useEffect(() => {
		const fetchAnalytics = async () => {
			try {
				const res = await fetch(`/api/assessments/${assessmentId}/analytics`);
				const result = await res.json();

				if (result.success) {
					setAssessment(result.assessment);
					setSectionAnalytics(result.sectionAnalytics || []);
					setSectionsRanked(result.sectionsRanked || []);
					setStudentsNeedingAttention(result.studentsNeedingAttention || []);
				} else {
					setError(result.error || "Failed to load analytics");
				}
			} catch (err) {
				console.error("Error fetching analytics:", err);
				setError("Failed to load assessment analytics");
			} finally {
				setLoading(false);
			}
		};

		fetchAnalytics();
	}, [assessmentId]);

	const formatTime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		if (hours > 0) return `${hours}h ${minutes}m`;
		return `${minutes}m`;
	};

	const getPerformanceColor = (percentage: number) => {
		if (percentage >= 80) return "text-green-600";
		if (percentage >= 60) return "text-yellow-600";
		if (percentage >= 40) return "text-orange-600";
		return "text-red-600";
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading analytics...</p>
				</div>
			</div>
		);
	}

	if (error || !assessment) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						Unable to Load Analytics
					</h2>
					<p className="text-gray-600 mb-4">{error}</p>
					<Link
						href="/admin/assessments"
						className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Assessments
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-6">
					<Link
						href="/admin/assessments"
						className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Assessments
					</Link>
					<div className="bg-white rounded-lg shadow-sm p-6">
						<h1 className="text-2xl font-bold text-gray-900 mb-2">
							{assessment.title}
						</h1>
						<p className="text-gray-600">{assessment.description}</p>
					</div>
				</div>

				{/* View Toggle */}
				<div className="bg-white rounded-lg shadow-sm p-4 mb-6">
					<div className="flex gap-2">
						<button
							onClick={() => setView("overview")}
							className={`px-4 py-2 rounded-lg font-medium transition-colors ${
								view === "overview"
									? "bg-blue-600 text-white"
									: "bg-gray-100 text-gray-700 hover:bg-gray-200"
							}`}>
							Overview
						</button>
						<button
							onClick={() => setView("sections")}
							className={`px-4 py-2 rounded-lg font-medium transition-colors ${
								view === "sections"
									? "bg-blue-600 text-white"
									: "bg-gray-100 text-gray-700 hover:bg-gray-200"
							}`}>
							Section Analysis
						</button>
						<button
							onClick={() => setView("students")}
							className={`px-4 py-2 rounded-lg font-medium transition-colors ${
								view === "students"
									? "bg-blue-600 text-white"
									: "bg-gray-100 text-gray-700 hover:bg-gray-200"
							}`}>
							Students Needing Attention
						</button>
					</div>
				</div>

				{/* Overview View */}
				{view === "overview" && (
					<div className="space-y-6">
						{/* Stats Cards */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							<div className="bg-white rounded-lg shadow-sm p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-600">Total Students</p>
										<p className="text-2xl font-bold text-gray-900">
											{assessment.stats.totalEligibleStudents}
										</p>
									</div>
									<Users className="w-10 h-10 text-blue-600" />
								</div>
							</div>

							<div className="bg-white rounded-lg shadow-sm p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-600">Completion Rate</p>
										<p className="text-2xl font-bold text-gray-900">
											{assessment.stats.completionRate.toFixed(1)}%
										</p>
									</div>
									<CheckCircle className="w-10 h-10 text-green-600" />
								</div>
							</div>

							<div className="bg-white rounded-lg shadow-sm p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-600">Average Score</p>
										<p className="text-2xl font-bold text-gray-900">
											{assessment.stats.averagePercentage.toFixed(1)}%
										</p>
									</div>
									<Award className="w-10 h-10 text-purple-600" />
								</div>
							</div>

							<div className="bg-white rounded-lg shadow-sm p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-600">Avg Time</p>
										<p className="text-2xl font-bold text-gray-900">
											{formatTime(assessment.stats.averageTimeSpent)}
										</p>
									</div>
									<Clock className="w-10 h-10 text-orange-600" />
								</div>
							</div>
						</div>

						{/* Weakest Sections */}
						<div className="bg-white rounded-lg shadow-sm p-6">
							<h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
								<TrendingDown className="w-5 h-5 mr-2 text-red-600" />
								Sections Needing Most Attention
							</h2>
							<div className="space-y-3">
								{sectionsRanked.slice(0, 5).map((section) => (
									<div
										key={section.sectionId}
										className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
										<div className="flex-1">
											<h3 className="font-medium text-gray-900">
												{section.sectionTitle}
											</h3>
											<p className="text-sm text-gray-600">
												{section.studentsBelowThreshold} students scoring below
												60%
											</p>
										</div>
										<div className="text-right">
											<p
												className={`text-2xl font-bold ${getPerformanceColor(
													section.averagePercentage
												)}`}>
												{section.averagePercentage.toFixed(1)}%
											</p>
											<p className="text-sm text-gray-600">
												Avg Rating: {section.averageRating.toFixed(1)}/5
											</p>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Students Needing Attention Summary */}
						<div className="bg-white rounded-lg shadow-sm p-6">
							<h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
								<AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
								Students Requiring Intervention (
								{studentsNeedingAttention.length})
							</h2>
							<p className="text-gray-600 mb-4">
								{studentsNeedingAttention.length} students scored below 60%
								overall and may need additional support.
							</p>
							<button
								onClick={() => setView("students")}
								className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
								View Details
							</button>
						</div>
					</div>
				)}

				{/* Section Analysis View */}
				{view === "sections" && (
					<div className="space-y-6">
						<div className="bg-white rounded-lg shadow-sm p-6">
							<h2 className="text-lg font-semibold text-gray-900 mb-4">
								Section-wise Performance Analysis
							</h2>
							<div className="space-y-4">
								{sectionAnalytics.map((section) => (
									<div
										key={section.sectionId}
										className="border border-gray-200 rounded-lg p-4">
										<div className="flex items-start justify-between mb-3">
											<div className="flex-1">
												<h3 className="font-semibold text-gray-900 mb-1">
													{section.sectionTitle}
												</h3>
												{section.sectionDescription && (
													<p className="text-sm text-gray-600 mb-2">
														{section.sectionDescription}
													</p>
												)}
												<p className="text-sm text-gray-600">
													{section.totalQuestions} questions •{" "}
													{section.responseCount} responses
												</p>
											</div>
											<div className="text-right">
												<p
													className={`text-3xl font-bold ${getPerformanceColor(
														section.averagePercentage
													)}`}>
													{section.averagePercentage.toFixed(1)}%
												</p>
												<p className="text-sm text-gray-600">
													Avg: {section.averageRating.toFixed(1)}/5
												</p>
											</div>
										</div>

										{section.studentsBelowThreshold > 0 && (
											<div className="mt-3 pt-3 border-t border-gray-200">
												<button
													onClick={() =>
														setSelectedSection(
															selectedSection === section.sectionId
																? null
																: section.sectionId
														)
													}
													className="text-sm text-blue-600 hover:text-blue-700 font-medium">
													{selectedSection === section.sectionId
														? "Hide"
														: "Show"}{" "}
													{section.studentsBelowThreshold} students needing
													attention
												</button>

												{selectedSection === section.sectionId && (
													<div className="mt-3 space-y-2">
														{section.studentsNeedingAttention.map(
															(student, idx) => (
																<div
																	key={idx}
																	className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
																	<div>
																		<p className="font-medium text-gray-900">
																			{student.studentName}
																		</p>
																		<p className="text-sm text-gray-600">
																			{student.course} - {student.batchName}
																		</p>
																	</div>
																	<div className="text-right">
																		<p className="text-lg font-bold text-red-600">
																			{student.percentage.toFixed(1)}%
																		</p>
																		<p className="text-sm text-gray-600">
																			{student.questionsAnswered}/
																			{student.totalQuestions} answered
																		</p>
																	</div>
																</div>
															)
														)}
													</div>
												)}
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					</div>
				)}

				{/* Students Needing Attention View */}
				{view === "students" && (
					<div className="space-y-6">
						<div className="bg-white rounded-lg shadow-sm p-6">
							<h2 className="text-lg font-semibold text-gray-900 mb-4">
								Students Requiring Intervention (
								{studentsNeedingAttention.length})
							</h2>

							{studentsNeedingAttention.length === 0 ? (
								<div className="text-center py-8">
									<CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
									<p className="text-gray-600">
										All students are performing well! No intervention needed.
									</p>
								</div>
							) : (
								<div className="space-y-4">
									{studentsNeedingAttention.map((student) => (
										<div
											key={student._id}
											className="border border-red-200 rounded-lg p-5 bg-red-50">
											<div className="flex items-start justify-between mb-4">
												<div>
													<h3 className="font-semibold text-gray-900 text-lg">
														{student.name}
													</h3>
													<p className="text-sm text-gray-600">
														{student.email}
													</p>
													<p className="text-sm text-gray-600">
														{student.course} - {student.batchName}
													</p>
												</div>
												<div className="text-right">
													<p className="text-3xl font-bold text-red-600">
														{student.overallPercentage?.toFixed(1)}%
													</p>
													<p className="text-sm text-gray-600">Overall Score</p>
												</div>
											</div>

											{student.sectionsNeedingAttention.length > 0 && (
												<div className="mt-4 pt-4 border-t border-red-200">
													<p className="text-sm font-medium text-gray-900 mb-2">
														Needs attention in:
													</p>
													<div className="flex flex-wrap gap-2">
														{student.sectionsNeedingAttention.map(
															(sectionTitle, idx) => (
																<span
																	key={idx}
																	className="px-3 py-1 bg-white border border-red-300 rounded-full text-sm text-red-700">
																	{sectionTitle}
																</span>
															)
														)}
													</div>
												</div>
											)}

											{student.sectionBreakdown.length > 0 && (
												<div className="mt-4 pt-4 border-t border-red-200">
													<p className="text-sm font-medium text-gray-900 mb-3">
														Section-wise Performance:
													</p>
													<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
														{student.sectionBreakdown.map((section, idx) => (
															<div
																key={idx}
																className={`p-3 rounded-lg ${
																	section.needsAttention
																		? "bg-white border border-red-300"
																		: "bg-green-50 border border-green-200"
																}`}>
																<div className="flex justify-between items-center">
																	<p className="text-sm font-medium text-gray-900">
																		{section.sectionTitle}
																	</p>
																	<p
																		className={`text-lg font-bold ${getPerformanceColor(
																			section.percentage
																		)}`}>
																		{section.percentage.toFixed(1)}%
																	</p>
																</div>
																<p className="text-xs text-gray-600 mt-1">
																	Avg Rating: {section.averageRating.toFixed(1)}
																	/5
																</p>
															</div>
														))}
													</div>
												</div>
											)}
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

"use client";

import React, { useState, useEffect } from "react";
import {
	ArrowLeft,
	User,
	Mail,
	GraduationCap,
	Calendar,
	Award,
	AlertTriangle,
	BarChart3,
	Clock,
	TrendingUp,
	TrendingDown,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface SectionPerformance {
	sectionTitle: string;
	attempts: number;
	averagePercentage: number;
	averageRating: number;
	needsAttention: boolean;
}

interface AssessmentPerformance {
	assessmentId: string;
	assessmentTitle: string;
	overallPercentage: number;
	overallAverageRating: number;
	completedAt: string;
	timeSpent: number;
	sectionScores: Array<{
		sectionId: string;
		sectionTitle: string;
		percentage: number;
		averageRating: number;
	}>;
}

interface Student {
	_id: string;
	name: string;
	email: string;
	course: string;
	batchName: string;
}

interface Analytics {
	student: Student;
	analytics: {
		totalAssessments: number;
		overallAveragePercentage: number;
		overallAverageRating: number;
		assessments: AssessmentPerformance[];
		sectionPerformance: SectionPerformance[];
		areasNeedingAttention: SectionPerformance[];
	};
}

export default function StudentIndividualAnalyticsPage() {
	const params = useParams();
	const studentId = params.studentId as string;

	const [data, setData] = useState<Analytics | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchAnalytics = async () => {
			try {
				const res = await fetch(`/api/students/${studentId}/analytics`);
				const result = await res.json();

				if (result.success) {
					setData(result);
				} else {
					setError(result.error || "Failed to load analytics");
				}
			} catch (err) {
				console.error("Error fetching analytics:", err);
				setError("Failed to load student analytics");
			} finally {
				setLoading(false);
			}
		};

		fetchAnalytics();
	}, [studentId]);

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

	const getPerformanceBg = (percentage: number) => {
		if (percentage >= 80) return "bg-green-100";
		if (percentage >= 60) return "bg-yellow-100";
		if (percentage >= 40) return "bg-orange-100";
		return "bg-red-100";
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

	if (error || !data) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						Unable to Load Analytics
					</h2>
					<p className="text-gray-600 mb-4">{error}</p>
					<Link
						href="/admin/students/analytics"
						className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Students
					</Link>
				</div>
			</div>
		);
	}

	const { student, analytics } = data;

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-6">
					<Link
						href="/admin/students/analytics"
						className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Students Analytics
					</Link>

					<div className="bg-white rounded-lg shadow-sm p-6">
						<div className="flex items-start justify-between">
							<div className="flex items-center space-x-4">
								<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
									<User className="w-8 h-8 text-blue-600" />
								</div>
								<div>
									<h1 className="text-2xl font-bold text-gray-900">
										{student.name}
									</h1>
									<div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
										<span className="flex items-center">
											<Mail className="w-4 h-4 mr-1" />
											{student.email}
										</span>
										<span className="flex items-center">
											<GraduationCap className="w-4 h-4 mr-1" />
											{student.course}
										</span>
										<span className="flex items-center">
											<Calendar className="w-4 h-4 mr-1" />
											{student.batchName}
										</span>
									</div>
								</div>
							</div>

							{analytics.overallAveragePercentage < 60 && (
								<div className="px-4 py-2 bg-red-100 text-red-700 rounded-lg flex items-center">
									<AlertTriangle className="w-5 h-5 mr-2" />
									<span className="font-medium">Needs Attention</span>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Summary Stats */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
					<div className="bg-white rounded-lg shadow-sm p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Total Assessments</p>
								<p className="text-2xl font-bold text-gray-900">
									{analytics.totalAssessments}
								</p>
							</div>
							<BarChart3 className="w-10 h-10 text-blue-600" />
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-sm p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Overall Average</p>
								<p
									className={`text-2xl font-bold ${getPerformanceColor(
										analytics.overallAveragePercentage
									)}`}>
									{analytics.overallAveragePercentage.toFixed(1)}%
								</p>
							</div>
							{analytics.overallAveragePercentage >= 60 ? (
								<TrendingUp className="w-10 h-10 text-green-600" />
							) : (
								<TrendingDown className="w-10 h-10 text-red-600" />
							)}
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-sm p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Average Rating</p>
								<p className="text-2xl font-bold text-purple-600">
									{analytics.overallAverageRating.toFixed(1)} / 5
								</p>
							</div>
							<Award className="w-10 h-10 text-purple-600" />
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-sm p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Areas Need Attention</p>
								<p className="text-2xl font-bold text-orange-600">
									{analytics.areasNeedingAttention.length}
								</p>
							</div>
							<AlertTriangle className="w-10 h-10 text-orange-600" />
						</div>
					</div>
				</div>

				{/* Areas Needing Attention */}
				{analytics.areasNeedingAttention.length > 0 && (
					<div className="bg-white rounded-lg shadow-sm p-6 mb-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
							<AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
							Areas Needing Attention
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{analytics.areasNeedingAttention.map((area, idx) => (
								<div
									key={idx}
									className="border border-red-200 rounded-lg p-4 bg-red-50">
									<h3 className="font-medium text-gray-900 mb-2">
										{area.sectionTitle}
									</h3>
									<div className="space-y-1 text-sm">
										<div className="flex justify-between">
											<span className="text-gray-600">Average Score:</span>
											<span
												className={`font-semibold ${getPerformanceColor(
													area.averagePercentage
												)}`}>
												{area.averagePercentage.toFixed(1)}%
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-600">Average Rating:</span>
											<span className="font-semibold text-gray-900">
												{area.averageRating.toFixed(1)} / 5
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-600">Attempts:</span>
											<span className="font-semibold text-gray-900">
												{area.attempts}
											</span>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Section Performance Summary */}
				<div className="bg-white rounded-lg shadow-sm p-6 mb-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">
						Section Performance Summary
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{analytics.sectionPerformance.map((section, idx) => (
							<div
								key={idx}
								className={`border rounded-lg p-4 ${
									section.needsAttention
										? "border-red-200 bg-red-50"
										: "border-gray-200 bg-gray-50"
								}`}>
								<h3 className="font-medium text-gray-900 mb-3">
									{section.sectionTitle}
								</h3>
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<span className="text-sm text-gray-600">Performance:</span>
										<span
											className={`text-lg font-bold ${getPerformanceColor(
												section.averagePercentage
											)}`}>
											{section.averagePercentage.toFixed(1)}%
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm text-gray-600">Avg Rating:</span>
										<span className="text-sm font-semibold text-gray-900">
											{section.averageRating.toFixed(1)} / 5
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm text-gray-600">Attempts:</span>
										<span className="text-sm font-semibold text-gray-900">
											{section.attempts}
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Assessment History */}
				<div className="bg-white rounded-lg shadow-sm p-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">
						Assessment History
					</h2>
					<div className="space-y-4">
						{analytics.assessments.map((assessment, idx) => (
							<div
								key={idx}
								className="border border-gray-200 rounded-lg p-5">
								<div className="flex items-start justify-between mb-4">
									<div className="flex-1">
										<h3 className="text-lg font-semibold text-gray-900 mb-2">
											{assessment.assessmentTitle}
										</h3>
										<div className="flex items-center space-x-4 text-sm text-gray-600">
											<span className="flex items-center">
												<Calendar className="w-4 h-4 mr-1" />
												{new Date(assessment.completedAt).toLocaleDateString()}
											</span>
											<span className="flex items-center">
												<Clock className="w-4 h-4 mr-1" />
												{formatTime(assessment.timeSpent)}
											</span>
										</div>
									</div>
									<div className="text-right">
										<p
											className={`text-3xl font-bold ${getPerformanceColor(
												assessment.overallPercentage
											)}`}>
											{assessment.overallPercentage.toFixed(1)}%
										</p>
										<p className="text-sm text-gray-600 mt-1">
											Avg: {assessment.overallAverageRating.toFixed(1)} / 5
										</p>
									</div>
								</div>

								{/* Section Scores */}
								{assessment.sectionScores.length > 0 && (
									<div className="mt-4 pt-4 border-t border-gray-200">
										<h4 className="text-sm font-medium text-gray-700 mb-3">
											Section Scores:
										</h4>
										<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
											{assessment.sectionScores.map((section, sIdx) => (
												<div
													key={sIdx}
													className={`p-3 rounded-lg ${getPerformanceBg(
														section.percentage
													)}`}>
													<p
														className="text-xs text-gray-700 mb-1 truncate"
														title={section.sectionTitle}>
														{section.sectionTitle}
													</p>
													<p
														className={`text-lg font-bold ${getPerformanceColor(
															section.percentage
														)}`}>
														{section.percentage.toFixed(1)}%
													</p>
													<p className="text-xs text-gray-600">
														{section.averageRating.toFixed(1)} / 5
													</p>
												</div>
											))}
										</div>
									</div>
								)}
							</div>
						))}

						{analytics.assessments.length === 0 && (
							<div className="text-center py-8 text-gray-600">
								<BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
								<p>No completed assessments yet</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

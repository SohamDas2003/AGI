"use client";

import React, { useState, useEffect } from "react";
import {
	ArrowLeft,
	Clock,
	CheckCircle,
	BarChart3,
	User,
	Calendar,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Answer {
	questionId: string;
	value: number;
}

interface Question {
	_id: string;
	text: string;
	isRequired: boolean;
	scaleOptions: {
		min: number;
		max: number;
		minLabel: string;
		maxLabel: string;
		labels: string[];
	};
}

interface Section {
	_id: string;
	title: string;
	description: string;
	questions: Question[];
}

interface Assessment {
	_id: string;
	title: string;
	description: string;
	sections: Section[];
	timeLimit?: number;
}

interface AssessmentResponse {
	_id: string;
	assessmentId: string;
	studentId: string;
	answers: Answer[];
	timeSpent: number;
	submittedAt: Date;
	isCompleted: boolean;
	overallPercentage?: number;
	overallAverageRating?: number;
	sectionScores?: Array<{
		sectionId: string;
		sectionTitle: string;
		score: number;
		maxPossibleScore: number;
		percentage: number;
		averageRating: number;
		questionsAnswered: number;
		totalQuestions: number;
	}>;
	assessment: Assessment;
}

export default function AssessmentResultsPage() {
	const params = useParams();
	const assessmentId = params.id as string;

	const [response, setResponse] = useState<AssessmentResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchResults = async () => {
			try {
				const res = await fetch(
					`/api/assessments/student/results/${assessmentId}`
				);
				const result = await res.json();

				if (result.success) {
					setResponse(result.response);
				} else {
					setError(result.error || "Failed to load results");
				}
			} catch (err) {
				console.error("Error fetching results:", err);
				setError("Failed to load assessment results");
			} finally {
				setLoading(false);
			}
		};

		fetchResults();
	}, [assessmentId]);

	const calculateSectionStats = (section: Section) => {
		const sectionAnswers =
			response?.answers.filter((answer) =>
				section.questions.some((q) => q._id === answer.questionId)
			) || [];

		const totalQuestions = section.questions.length;
		const answeredQuestions = sectionAnswers.length;
		const averageScore =
			sectionAnswers.length > 0
				? sectionAnswers.reduce((sum, answer) => sum + answer.value, 0) /
				  sectionAnswers.length
				: 0;

		return {
			totalQuestions,
			answeredQuestions,
			averageScore,
			completionRate: (answeredQuestions / totalQuestions) * 100,
		};
	};

	const calculateOverallStats = () => {
		if (!response || !response.assessment) return null;

		const totalQuestions = response.assessment.sections.reduce(
			(total, section) => total + section.questions.length,
			0
		);
		const answeredQuestions = response.answers.length;
		const overallAverage =
			response.answers.length > 0
				? response.answers.reduce((sum, answer) => sum + answer.value, 0) /
				  response.answers.length
				: 0;

		return {
			totalQuestions,
			answeredQuestions,
			overallAverage,
			completionRate: (answeredQuestions / totalQuestions) * 100,
			timeSpent: response.timeSpent,
		};
	};

	const formatTime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;

		if (hours > 0) {
			return `${hours}h ${minutes}m ${secs}s`;
		} else if (minutes > 0) {
			return `${minutes}m ${secs}s`;
		}
		return `${secs}s`;
	};

	const getScoreColor = (score: number, max: number = 5) => {
		const percentage = (score / max) * 100;
		if (percentage >= 80) return "text-green-600";
		if (percentage >= 60) return "text-yellow-600";
		if (percentage >= 40) return "text-orange-600";
		return "text-red-600";
	};

	const getScoreBgColor = (score: number, max: number = 5) => {
		const percentage = (score / max) * 100;
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
					<p className="text-gray-600">Loading results...</p>
				</div>
			</div>
		);
	}

	if (error || !response) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<CheckCircle className="w-8 h-8 text-red-600" />
					</div>
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						Unable to Load Results
					</h2>
					<p className="text-gray-600 mb-4">
						{error || "Assessment results not found"}
					</p>
					<Link
						href="/student/assessments"
						className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Assessments
					</Link>
				</div>
			</div>
		);
	}

	const overallStats = calculateOverallStats();

	return (
		<div className="w-full max-w-6xl mx-auto space-y-4 sm:space-y-6">
			{/* Header */}
			<div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
					<div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
						<Link
							href="/student/assessments"
							className="text-gray-600 hover:text-gray-900 flex-shrink-0 mt-1">
							<ArrowLeft className="w-5 h-5" />
						</Link>
						<div className="flex-1 min-w-0">
							<h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
								{response.assessment.title}
							</h1>
							<p className="text-sm sm:text-base text-gray-600">
								Assessment Results
							</p>
						</div>
					</div>

					<div className="flex items-center justify-center sm:justify-end flex-shrink-0">
						<div className="text-center">
							<div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
								<CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
							</div>
							<span className="text-xs sm:text-sm font-medium text-green-600">
								Completed
							</span>
						</div>
					</div>
				</div>

				{/* Submission Info */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
					<div className="flex items-center space-x-3">
						<Calendar className="w-5 h-5 text-gray-500 flex-shrink-0" />
						<div className="min-w-0">
							<div className="text-xs sm:text-sm text-gray-600">Submitted</div>
							<div className="text-sm sm:text-base font-medium truncate">
								{new Date(response.submittedAt).toLocaleDateString()} at{" "}
								{new Date(response.submittedAt).toLocaleTimeString()}
							</div>
						</div>
					</div>
					<div className="flex items-center space-x-3">
						<Clock className="w-5 h-5 text-gray-500 flex-shrink-0" />
						<div className="min-w-0">
							<div className="text-xs sm:text-sm text-gray-600">Time Spent</div>
							<div className="text-sm sm:text-base font-medium">
								{formatTime(response.timeSpent)}
							</div>
						</div>
					</div>
					<div className="flex items-center space-x-3">
						<User className="w-5 h-5 text-gray-500 flex-shrink-0" />
						<div className="min-w-0">
							<div className="text-xs sm:text-sm text-gray-600">
								Questions Answered
							</div>
							<div className="text-sm sm:text-base font-medium">
								{overallStats?.answeredQuestions} /{" "}
								{overallStats?.totalQuestions}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Overall Statistics */}
			{overallStats && (
				<div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
					<h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center">
						<BarChart3 className="w-5 h-5 mr-2" />
						Overall Performance
					</h2>

					<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
						<div className="text-center">
							<div
								className={`text-2xl sm:text-3xl font-bold mb-1 ${getScoreColor(
									response.overallAverageRating || overallStats.overallAverage
								)}`}>
								{(
									response.overallAverageRating || overallStats.overallAverage
								).toFixed(1)}
							</div>
							<div className="text-xs sm:text-sm text-gray-600">
								Average Rating
							</div>
							<div className="text-xs text-gray-500">out of 5.0</div>
						</div>

						<div className="text-center">
							<div
								className={`text-2xl sm:text-3xl font-bold mb-1 ${getScoreColor(
									(response.overallPercentage || 0) / 20
								)}`}>
								{(response.overallPercentage || 0).toFixed(1)}%
							</div>
							<div className="text-xs sm:text-sm text-gray-600">
								Overall Score
							</div>
						</div>

						<div className="text-center">
							<div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">
								{overallStats.answeredQuestions}
							</div>
							<div className="text-xs sm:text-sm text-gray-600">
								Questions Answered
							</div>
						</div>

						<div className="text-center">
							<div className="text-2xl sm:text-3xl font-bold text-indigo-600 mb-1">
								{response.assessment.sections.length}
							</div>
							<div className="text-xs sm:text-sm text-gray-600">
								Sections Completed
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Section-wise Results */}
			<div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
				<h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
					Section-wise Results
				</h2>

				{/* Section Performance Summary */}
				{response.sectionScores && response.sectionScores.length > 0 && (
					<div className="mb-4 sm:mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
						{response.sectionScores.map((sectionScore) => (
							<div
								key={sectionScore.sectionId}
								className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-gray-50">
								<h4 className="font-medium text-gray-900 mb-2 break-words text-sm sm:text-base">
									{sectionScore.sectionTitle}
								</h4>
								<div className="flex items-center justify-between mb-2">
									<span className="text-xs sm:text-sm text-gray-600">
										Score:
									</span>
									<span
										className={`text-lg sm:text-xl font-bold ${getScoreColor(
											sectionScore.percentage / 20
										)}`}>
										{sectionScore.percentage.toFixed(1)}%
									</span>
								</div>
								<div className="flex items-center justify-between mb-2">
									<span className="text-xs sm:text-sm text-gray-600">
										Avg Rating:
									</span>
									<span
										className={`font-semibold text-sm sm:text-base ${getScoreColor(
											sectionScore.averageRating
										)}`}>
										{sectionScore.averageRating.toFixed(1)} / 5
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-xs sm:text-sm text-gray-600">
										Completed:
									</span>
									<span className="font-medium text-gray-900 text-sm sm:text-base">
										{sectionScore.questionsAnswered} /{" "}
										{sectionScore.totalQuestions}
									</span>
								</div>
								{sectionScore.percentage < 60 && (
									<div className="mt-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded text-center">
										Needs Improvement
									</div>
								)}
							</div>
						))}
					</div>
				)}

				<div className="space-y-4 sm:space-y-6">
					{response.assessment.sections.map((section, index) => {
						const stats = calculateSectionStats(section);

						return (
							<div
								key={section._id}
								className="border border-gray-200 rounded-lg p-4 sm:p-6">
								<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
									<div className="min-w-0 flex-1">
										<h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
											Section {index + 1}: {section.title}
										</h3>
										{section.description && (
											<p className="text-gray-600 mt-1 text-sm sm:text-base break-words">
												{section.description}
											</p>
										)}
									</div>

									<div
										className={`px-3 py-1 rounded-full text-sm font-medium flex-shrink-0 self-start ${getScoreBgColor(
											stats.averageScore
										)} ${getScoreColor(stats.averageScore)}`}>
										{stats.averageScore.toFixed(1)} / 5.0
									</div>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
									<div className="text-center p-3 bg-gray-50 rounded-lg">
										<div className="text-base sm:text-lg font-semibold text-gray-900">
											{stats.answeredQuestions} / {stats.totalQuestions}
										</div>
										<div className="text-xs sm:text-sm text-gray-600">
											Questions Answered
										</div>
									</div>

									<div className="text-center p-3 bg-gray-50 rounded-lg">
										<div className="text-base sm:text-lg font-semibold text-blue-600">
											{stats.completionRate.toFixed(0)}%
										</div>
										<div className="text-xs sm:text-sm text-gray-600">
											Completion Rate
										</div>
									</div>

									<div className="text-center p-3 bg-gray-50 rounded-lg">
										<div
											className={`text-base sm:text-lg font-semibold ${getScoreColor(
												stats.averageScore
											)}`}>
											{stats.averageScore.toFixed(1)}
										</div>
										<div className="text-xs sm:text-sm text-gray-600">
											Average Score
										</div>
									</div>
								</div>

								{/* Question Responses */}
								<div className="space-y-3 sm:space-y-4">
									<h4 className="font-medium text-gray-900 text-sm sm:text-base">
										Your Responses:
									</h4>
									{section.questions.map((question, qIndex) => {
										const answer = response.answers.find(
											(a) => a.questionId === question._id
										);

										return (
											<div
												key={question._id}
												className="bg-gray-50 rounded-lg p-3 sm:p-4">
												<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
													<div className="flex-1 min-w-0">
														<span className="text-xs sm:text-sm font-medium text-gray-500">
															{index + 1}.{qIndex + 1}
														</span>
														<p className="text-gray-900 mt-1 text-sm sm:text-base break-words">
															{question.text}
														</p>
													</div>

													{answer ? (
														<div className="sm:ml-4 sm:text-right flex-shrink-0">
															<div
																className={`inline-flex items-center px-2 py-1 rounded text-xs sm:text-sm font-medium ${getScoreBgColor(
																	answer.value
																)} ${getScoreColor(answer.value)}`}>
																{answer.value} / 5
															</div>
															<div className="text-xs text-gray-500 mt-1 break-words">
																{question.scaleOptions.labels[answer.value - 1]}
															</div>
														</div>
													) : (
														<div className="sm:ml-4 sm:text-right flex-shrink-0">
															<span className="inline-flex items-center px-2 py-1 rounded text-xs sm:text-sm font-medium bg-gray-200 text-gray-600">
																Not answered
															</span>
														</div>
													)}
												</div>

												{/* Scale visualization */}
												{answer && (
													<div className="mt-3">
														<div className="flex items-center justify-between text-xs text-gray-500 mb-1">
															<span className="truncate">
																{question.scaleOptions.minLabel}
															</span>
															<span className="truncate">
																{question.scaleOptions.maxLabel}
															</span>
														</div>
														<div className="flex space-x-1">
															{question.scaleOptions.labels.map(
																(label, labelIndex) => (
																	<div
																		key={labelIndex}
																		className={`flex-1 h-2 rounded ${
																			labelIndex + 1 === answer.value
																				? "bg-blue-600"
																				: "bg-gray-200"
																		}`}
																		title={label}
																	/>
																)
															)}
														</div>
													</div>
												)}
											</div>
										);
									})}
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* Actions */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
				<Link
					href="/student/assessments"
					className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 w-full sm:w-auto">
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Assessments
				</Link>

				<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
					<button
						onClick={() => window.print()}
						className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 w-full sm:w-auto">
						Print Results
					</button>

					<Link
						href={`/student/assessments/${assessmentId}`}
						className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-auto">
						View Assessment Details
					</Link>
				</div>
			</div>
		</div>
	);
}

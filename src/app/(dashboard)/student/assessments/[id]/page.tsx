"use client";

import React, { useState, useEffect } from "react";
import {
	ArrowLeft,
	Clock,
	Users,
	BookOpen,
	Calendar,
	Play,
	Eye,
	CheckCircle,
	AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

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
	instructions: string;
	timeLimit?: number;
	isPublished: boolean;
	createdAt: Date;
	updatedAt: Date;
	sections: Section[];
	isAssigned?: boolean;
	isCompleted?: boolean;
	hasStarted?: boolean;
	attempts?: number;
	lastAttemptAt?: Date;
}

export default function AssessmentDetailsPage() {
	const params = useParams();
	const assessmentId = params.id as string;

	const [assessment, setAssessment] = useState<Assessment | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchAssessment = async () => {
			try {
				const response = await fetch(
					`/api/assessments/student/details/${assessmentId}`
				);
				const result = await response.json();

				if (result.success) {
					setAssessment(result.assessment);
				} else {
					setError(result.error || "Failed to load assessment details");
				}
			} catch (err) {
				console.error("Error fetching assessment:", err);
				setError("Failed to load assessment details");
			} finally {
				setLoading(false);
			}
		};

		fetchAssessment();
	}, [assessmentId]);

	const getStatusInfo = () => {
		if (!assessment) return null;

		if (assessment.isCompleted) {
			return {
				status: "completed",
				label: "Completed",
				color: "text-green-600",
				bgColor: "bg-green-100",
				icon: CheckCircle,
			};
		}

		if (assessment.hasStarted) {
			return {
				status: "in-progress",
				label: "In Progress",
				color: "text-yellow-600",
				bgColor: "bg-yellow-100",
				icon: Clock,
			};
		}

		if (assessment.isAssigned) {
			return {
				status: "assigned",
				label: "Assigned",
				color: "text-blue-600",
				bgColor: "bg-blue-100",
				icon: BookOpen,
			};
		}

		return {
			status: "not-assigned",
			label: "Not Assigned",
			color: "text-gray-600",
			bgColor: "bg-gray-100",
			icon: AlertTriangle,
		};
	};

	const getTotalQuestions = () => {
		if (!assessment) return 0;
		return assessment.sections.reduce(
			(total, section) => total + section.questions.length,
			0
		);
	};

	const getRequiredQuestions = () => {
		if (!assessment) return 0;
		return assessment.sections.reduce(
			(total, section) =>
				total + section.questions.filter((q) => q.isRequired).length,
			0
		);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading assessment details...</p>
				</div>
			</div>
		);
	}

	if (error || !assessment) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						Assessment Not Found
					</h2>
					<p className="text-gray-600 mb-4">
						{error ||
							"The assessment you&apos;re looking for doesn&apos;t exist."}
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

	const statusInfo = getStatusInfo();
	const StatusIcon = statusInfo?.icon || BookOpen;

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			{/* Header */}
			<div className="bg-white rounded-lg border border-gray-200 p-6">
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center space-x-4">
						<Link
							href="/student/assessments"
							className="text-gray-600 hover:text-gray-900">
							<ArrowLeft className="w-5 h-5" />
						</Link>
						<div>
							<h1 className="text-2xl font-bold text-gray-900">
								{assessment.title}
							</h1>
							{assessment.description && (
								<p className="text-gray-600">{assessment.description}</p>
							)}
						</div>
					</div>

					{statusInfo && (
						<div
							className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
							<StatusIcon className="w-4 h-4 mr-2" />
							{statusInfo.label}
						</div>
					)}
				</div>

				{/* Assessment Metadata */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
					<div className="text-center">
						<div className="text-2xl font-bold text-blue-600 mb-1">
							{getTotalQuestions()}
						</div>
						<div className="text-sm text-gray-600">Total Questions</div>
					</div>

					<div className="text-center">
						<div className="text-2xl font-bold text-green-600 mb-1">
							{assessment.sections.length}
						</div>
						<div className="text-sm text-gray-600">Sections</div>
					</div>

					<div className="text-center">
						<div className="text-2xl font-bold text-orange-600 mb-1">
							{getRequiredQuestions()}
						</div>
						<div className="text-sm text-gray-600">Required Questions</div>
					</div>

					{assessment.timeLimit && (
						<div className="text-center">
							<div className="text-2xl font-bold text-purple-600 mb-1">
								{assessment.timeLimit}
							</div>
							<div className="text-sm text-gray-600">Minutes</div>
						</div>
					)}
				</div>

				{/* Attempt Information */}
				{(assessment.attempts !== undefined || assessment.lastAttemptAt) && (
					<div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
						<div className="flex items-center space-x-4">
							{assessment.attempts !== undefined && (
								<div>
									<span className="text-sm text-blue-600 font-medium">
										Attempts:{" "}
									</span>
									<span className="text-blue-800">{assessment.attempts}</span>
								</div>
							)}
							{assessment.lastAttemptAt && (
								<div>
									<span className="text-sm text-blue-600 font-medium">
										Last Attempt:{" "}
									</span>
									<span className="text-blue-800">
										{new Date(assessment.lastAttemptAt).toLocaleDateString()} at{" "}
										{new Date(assessment.lastAttemptAt).toLocaleTimeString()}
									</span>
								</div>
							)}
						</div>
					</div>
				)}
			</div>

			{/* Instructions */}
			{assessment.instructions && (
				<div className="bg-white rounded-lg border border-gray-200 p-6">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						Instructions
					</h2>
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
						<p className="text-blue-900 whitespace-pre-wrap">
							{assessment.instructions}
						</p>
					</div>
				</div>
			)}

			{/* Sections Overview */}
			<div className="bg-white rounded-lg border border-gray-200 p-6">
				<h2 className="text-xl font-semibold text-gray-900 mb-6">
					Assessment Sections
				</h2>

				<div className="space-y-4">
					{assessment.sections.map((section, index) => (
						<div
							key={section._id}
							className="border border-gray-200 rounded-lg p-4">
							<div className="flex items-start justify-between mb-3">
								<div className="flex-1">
									<h3 className="text-lg font-semibold text-gray-900">
										Section {index + 1}: {section.title}
									</h3>
									{section.description && (
										<p className="text-gray-600 mt-1">{section.description}</p>
									)}
								</div>

								<div className="flex items-center space-x-4 ml-4">
									<div className="text-center">
										<div className="text-lg font-semibold text-blue-600">
											{section.questions.length}
										</div>
										<div className="text-xs text-gray-500">Questions</div>
									</div>

									<div className="text-center">
										<div className="text-lg font-semibold text-green-600">
											{section.questions.filter((q) => q.isRequired).length}
										</div>
										<div className="text-xs text-gray-500">Required</div>
									</div>
								</div>
							</div>

							{/* Question Preview */}
							<div className="mt-4">
								<h4 className="font-medium text-gray-900 mb-2">
									Sample Questions:
								</h4>
								<div className="space-y-2">
									{section.questions.slice(0, 3).map((question, qIndex) => (
										<div
											key={question._id}
											className="text-sm text-gray-600 flex items-start space-x-2">
											<span className="text-gray-400 mt-0.5">
												{index + 1}.{qIndex + 1}
											</span>
											<span className="flex-1">
												{question.text}
												{question.isRequired && (
													<span className="text-red-500 ml-1">*</span>
												)}
											</span>
										</div>
									))}
									{section.questions.length > 3 && (
										<div className="text-sm text-gray-500 italic ml-6">
											... and {section.questions.length - 3} more questions
										</div>
									)}
								</div>
							</div>

							{/* Scale Information */}
							{section.questions.length > 0 && (
								<div className="mt-4 p-3 bg-gray-50 rounded-lg">
									<div className="text-sm text-gray-600 mb-2">
										Rating Scale:
									</div>
									<div className="flex items-center justify-between text-xs text-gray-500">
										<span>{section.questions[0].scaleOptions.minLabel}</span>
										<div className="flex space-x-1">
											{section.questions[0].scaleOptions.labels.map(
												(label, labelIndex) => (
													<div
														key={labelIndex}
														className="text-center">
														<div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">
															{labelIndex + 1}
														</div>
														<div className="mt-1 max-w-12 text-center leading-tight">
															{label}
														</div>
													</div>
												)
											)}
										</div>
										<span>{section.questions[0].scaleOptions.maxLabel}</span>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			</div>

			{/* Assessment Info */}
			<div className="bg-white rounded-lg border border-gray-200 p-6">
				<h2 className="text-xl font-semibold text-gray-900 mb-4">
					Assessment Information
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-4">
						<div className="flex items-center space-x-3">
							<Calendar className="w-5 h-5 text-gray-500" />
							<div>
								<div className="text-sm text-gray-600">Created</div>
								<div className="font-medium">
									{new Date(assessment.createdAt).toLocaleDateString()}
								</div>
							</div>
						</div>

						{assessment.updatedAt !== assessment.createdAt && (
							<div className="flex items-center space-x-3">
								<Clock className="w-5 h-5 text-gray-500" />
								<div>
									<div className="text-sm text-gray-600">Last Updated</div>
									<div className="font-medium">
										{new Date(assessment.updatedAt).toLocaleDateString()}
									</div>
								</div>
							</div>
						)}
					</div>

					<div className="space-y-4">
						<div className="flex items-center space-x-3">
							<Users className="w-5 h-5 text-gray-500" />
							<div>
								<div className="text-sm text-gray-600">Status</div>
								<div className="font-medium">
									{assessment.isPublished ? "Published" : "Draft"}
								</div>
							</div>
						</div>

						{assessment.timeLimit && (
							<div className="flex items-center space-x-3">
								<Clock className="w-5 h-5 text-gray-500" />
								<div>
									<div className="text-sm text-gray-600">Time Limit</div>
									<div className="font-medium">
										{assessment.timeLimit} minutes
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Actions */}
			<div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
				<Link
					href="/student/assessments"
					className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50">
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Assessments
				</Link>

				<div className="flex space-x-3">
					{assessment.isCompleted ? (
						<Link
							href={`/student/assessments/${assessmentId}/results`}
							className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
							<Eye className="w-4 h-4 mr-2" />
							View Results
						</Link>
					) : assessment.isAssigned ? (
						<Link
							href={`/student/assessments/${assessmentId}/take`}
							className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
							<Play className="w-4 h-4 mr-2" />
							{assessment.hasStarted
								? "Continue Assessment"
								: "Start Assessment"}
						</Link>
					) : (
						<div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed">
							<AlertTriangle className="w-4 h-4 mr-2" />
							Not Available
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

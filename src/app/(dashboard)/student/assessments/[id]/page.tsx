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
		<div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
			{/* Header */}
			<div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
				<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
					<div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
						<Link
							href="/student/assessments"
							className="text-gray-600 hover:text-gray-900 flex-shrink-0 mt-1">
							<ArrowLeft className="w-5 h-5" />
						</Link>
						<div className="flex-1 min-w-0">
							<h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
								{assessment.title}
							</h1>
							{assessment.description && (
								<p className="text-sm sm:text-base text-gray-600 mt-1 break-words">
									{assessment.description}
								</p>
							)}
						</div>
					</div>

					{statusInfo && (
						<div
							className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex-shrink-0 ${statusInfo.bgColor} ${statusInfo.color}`}>
							<StatusIcon className="w-4 h-4 mr-2" />
							{statusInfo.label}
						</div>
					)}
				</div>

				{/* Assessment Metadata */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
					<div className="text-center">
						<div className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">
							{getTotalQuestions()}
						</div>
						<div className="text-xs sm:text-sm text-gray-600">
							Total Questions
						</div>
					</div>

					<div className="text-center">
						<div className="text-xl sm:text-2xl font-bold text-green-600 mb-1">
							{assessment.sections.length}
						</div>
						<div className="text-xs sm:text-sm text-gray-600">Sections</div>
					</div>

					<div className="text-center">
						<div className="text-xl sm:text-2xl font-bold text-orange-600 mb-1">
							{getRequiredQuestions()}
						</div>
						<div className="text-xs sm:text-sm text-gray-600">
							Required Questions
						</div>
					</div>

					{assessment.timeLimit && (
						<div className="text-center">
							<div className="text-xl sm:text-2xl font-bold text-purple-600 mb-1">
								{assessment.timeLimit}
							</div>
							<div className="text-xs sm:text-sm text-gray-600">Minutes</div>
						</div>
					)}
				</div>

				{/* Attempt Information */}
				{(assessment.attempts !== undefined || assessment.lastAttemptAt) && (
					<div className="mt-4 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
						<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
							{assessment.attempts !== undefined && (
								<div className="text-sm">
									<span className="text-blue-600 font-medium">Attempts: </span>
									<span className="text-blue-800">{assessment.attempts}</span>
								</div>
							)}
							{assessment.lastAttemptAt && (
								<div className="text-sm">
									<span className="text-blue-600 font-medium">
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
				<div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
					<h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
						Instructions
					</h2>
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
						<p className="text-sm sm:text-base text-blue-900 whitespace-pre-wrap break-words">
							{assessment.instructions}
						</p>
					</div>
				</div>
			)}

			{/* Assessment Info */}
			<div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
				<h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
					Assessment Information
				</h2>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
					<div className="space-y-4">
						<div className="flex items-center space-x-3">
							<Calendar className="w-5 h-5 text-gray-500 flex-shrink-0" />
							<div className="min-w-0">
								<div className="text-xs sm:text-sm text-gray-600">Created</div>
								<div className="text-sm sm:text-base font-medium break-words">
									{new Date(assessment.createdAt).toLocaleDateString()}
								</div>
							</div>
						</div>

						{assessment.updatedAt !== assessment.createdAt && (
							<div className="flex items-center space-x-3">
								<Clock className="w-5 h-5 text-gray-500 flex-shrink-0" />
								<div className="min-w-0">
									<div className="text-xs sm:text-sm text-gray-600">
										Last Updated
									</div>
									<div className="text-sm sm:text-base font-medium break-words">
										{new Date(assessment.updatedAt).toLocaleDateString()}
									</div>
								</div>
							</div>
						)}
					</div>

					<div className="space-y-4">
						<div className="flex items-center space-x-3">
							<Users className="w-5 h-5 text-gray-500 flex-shrink-0" />
							<div className="min-w-0">
								<div className="text-xs sm:text-sm text-gray-600">Status</div>
								<div className="text-sm sm:text-base font-medium">
									{assessment.isPublished ? "Published" : "Draft"}
								</div>
							</div>
						</div>

						{assessment.timeLimit && (
							<div className="flex items-center space-x-3">
								<Clock className="w-5 h-5 text-gray-500 flex-shrink-0" />
								<div className="min-w-0">
									<div className="text-xs sm:text-sm text-gray-600">
										Time Limit
									</div>
									<div className="text-sm sm:text-base font-medium">
										{assessment.timeLimit} minutes
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Sections Quick Names */}
			<div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
				<div className="text-xs sm:text-sm text-gray-600 mb-2">Sections</div>
				<div className="flex gap-2 overflow-x-auto pb-2">
					{assessment.sections.map((section, idx) => (
						<div
							key={section._id}
							className="flex-none px-2 sm:px-3 py-1 sm:py-2 bg-gray-50 rounded-md text-xs text-gray-700 whitespace-nowrap">
							{idx + 1}. {section.title}
						</div>
					))}
				</div>
			</div>

			{/* Actions */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
				<Link
					href="/student/assessments"
					className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 bg-white hover:bg-gray-50 transition-colors">
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Assessments
				</Link>

				<div className="flex flex-col sm:flex-row gap-3">
					{assessment.isCompleted ? (
						<Link
							href={`/student/assessments/${assessmentId}/results`}
							className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm sm:text-base rounded-lg hover:bg-green-700 transition-colors">
							<Eye className="w-4 h-4 mr-2" />
							View Results
						</Link>
					) : assessment.isAssigned ? (
						<Link
							href={`/student/assessments/${assessmentId}/take`}
							className="inline-flex items-center justify-center px-6 py-2 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 font-medium transition-colors">
							<Play className="w-4 h-4 mr-2" />
							{assessment.hasStarted
								? "Continue Assessment"
								: "Start Assessment"}
						</Link>
					) : (
						<div className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-500 text-sm sm:text-base rounded-lg cursor-not-allowed">
							<AlertTriangle className="w-4 h-4 mr-2" />
							Not Available
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

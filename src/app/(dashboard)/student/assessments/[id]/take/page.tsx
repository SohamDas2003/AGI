"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
	ArrowLeft,
	Clock,
	CheckCircle,
	AlertTriangle,
	Send,
	Info,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface ScaleOptions {
	min: number;
	max: number;
	minLabel: string;
	maxLabel: string;
	labels: string[];
}

interface Question {
	_id: string;
	text: string;
	isRequired: boolean;
	scaleOptions: ScaleOptions;
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
	sections: Section[];
}

interface Answer {
	questionId: string;
	value: number;
}

export default function TakeAssessmentPage() {
	const params = useParams();
	const router = useRouter();
	const assessmentId = params.id as string;

	const [assessment, setAssessment] = useState<Assessment | null>(null);
	const [answers, setAnswers] = useState<Record<string, number>>({});
	const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
	const [startTime, setStartTime] = useState<Date | null>(null);
	const [showInstructions, setShowInstructions] = useState(true);

	const handleSubmit = useCallback(
		async (isAutoSubmit = false) => {
			if (!assessment || submitting) return;

			// Check required questions
			const unansweredRequired = assessment.sections.flatMap((section) =>
				section.questions.filter((q) => q.isRequired && !answers[q._id])
			);

			if (!isAutoSubmit && unansweredRequired.length > 0) {
				alert(
					`Please answer all required questions. ${unansweredRequired.length} required questions remaining.`
				);
				return;
			}

			setSubmitting(true);

			try {
				const submissionAnswers: Answer[] = Object.entries(answers).map(
					([questionId, value]) => ({
						questionId,
						value,
					})
				);

				const response = await fetch(
					`/api/assessments/student/submit/${assessmentId}`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							answers: submissionAnswers,
							timeSpent: startTime
								? Math.floor((Date.now() - startTime.getTime()) / 1000)
								: undefined,
							isAutoSubmit,
						}),
					}
				);

				const result = await response.json();

				if (result.success) {
					alert(
						isAutoSubmit
							? "Assessment auto-submitted due to time limit!"
							: "Assessment submitted successfully!"
					);
					router.push(`/student/assessments/${assessmentId}/results`);
				} else {
					alert("Error submitting assessment: " + result.error);
				}
			} catch (error) {
				console.error("Error submitting assessment:", error);
				alert("Failed to submit assessment. Please try again.");
			} finally {
				setSubmitting(false);
			}
		},
		[assessment, submitting, answers, assessmentId, startTime, router]
	);

	const handleAutoSubmit = useCallback(async () => {
		await handleSubmit(true);
	}, [handleSubmit]);

	// Timer effect
	useEffect(() => {
		if (!assessment?.timeLimit || timeRemaining === null || timeRemaining <= 0)
			return;

		const timer = setInterval(() => {
			setTimeRemaining((prev) => {
				if (prev && prev <= 1) {
					handleAutoSubmit();
					return 0;
				}
				return prev ? prev - 1 : null;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [timeRemaining, assessment?.timeLimit, handleAutoSubmit]);

	const fetchAssessment = useCallback(async () => {
		try {
			const response = await fetch(
				`/api/assessments/student/start/${assessmentId}`,
				{
					method: "POST",
				}
			);
			const result = await response.json();

			if (result.success) {
				setAssessment(result.assessment);
				if (result.assessment.timeLimit) {
					setTimeRemaining(result.assessment.timeLimit * 60);
				}
				setStartTime(new Date());
			} else {
				alert("Error: " + result.error);
				router.push("/student/assessments");
			}
		} catch (error) {
			console.error("Error starting assessment:", error);
			alert("Failed to start assessment. Please try again.");
			router.push("/student/assessments");
		} finally {
			setLoading(false);
		}
	}, [assessmentId, router]);

	useEffect(() => {
		fetchAssessment();
	}, [fetchAssessment]);

	const handleAnswerChange = (questionId: string, value: number) => {
		setAnswers((prev) => ({
			...prev,
			[questionId]: value,
		}));
	};

	const formatTime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;

		if (hours > 0) {
			return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
				.toString()
				.padStart(2, "0")}`;
		}
		return `${minutes}:${secs.toString().padStart(2, "0")}`;
	};

	const getProgressStats = () => {
		const totalQuestions =
			assessment?.sections.reduce(
				(total, section) => total + section.questions.length,
				0
			) || 0;
		const answeredQuestions = Object.keys(answers).length;
		const requiredQuestions =
			assessment?.sections.reduce(
				(total, section) =>
					total + section.questions.filter((q) => q.isRequired).length,
				0
			) || 0;
		const answeredRequired =
			assessment?.sections.reduce(
				(total, section) =>
					total +
					section.questions.filter((q) => q.isRequired && answers[q._id])
						.length,
				0
			) || 0;

		return {
			total: totalQuestions,
			answered: answeredQuestions,
			required: requiredQuestions,
			answeredRequired,
		};
	};

	const isCurrentSectionComplete = () => {
		if (!assessment) return false;
		const currentSection = assessment.sections[currentSectionIndex];
		if (!currentSection) return false;

		// Check if all required questions in current section are answered
		const requiredQuestions = currentSection.questions.filter(
			(q) => q.isRequired
		);
		const answeredRequired = requiredQuestions.filter((q) => answers[q._id]);

		return answeredRequired.length === requiredQuestions.length;
	};

	const progress = getProgressStats();

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading assessment...</p>
				</div>
			</div>
		);
	}

	if (!assessment) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						Assessment Not Found
					</h2>
					<p className="text-gray-600 mb-4">
						The assessment you&apos;re looking for doesn&apos;t exist or is no
						longer available.
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

	// Instructions screen
	if (showInstructions) {
		return (
			<div className="max-w-4xl mx-auto space-y-6">
				<div className="bg-white rounded-lg border border-gray-200 p-8">
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold text-gray-900 mb-2">
							{assessment.title}
						</h1>
						{assessment.description && (
							<p className="text-gray-600 text-lg">{assessment.description}</p>
						)}
					</div>

					{/* Assessment Info */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
						<div className="text-center">
							<div className="text-2xl font-bold text-blue-600 mb-1">
								{assessment.sections.reduce(
									(total, section) => total + section.questions.length,
									0
								)}
							</div>
							<div className="text-sm text-gray-600">Total Questions</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-green-600 mb-1">
								{assessment.sections.length}
							</div>
							<div className="text-sm text-gray-600">Sections</div>
						</div>
						{assessment.timeLimit && (
							<div className="text-center">
								<div className="text-2xl font-bold text-orange-600 mb-1">
									{assessment.timeLimit}
								</div>
								<div className="text-sm text-gray-600">Minutes</div>
							</div>
						)}
					</div>

					{/* Sections Overview */}
					<div className="mb-8">
						<h2 className="text-xl font-semibold text-gray-900 mb-4">
							Assessment Sections
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{assessment.sections.map((section, index) => (
								<div
									key={section._id}
									className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg">
									<span className="font-semibold text-blue-600">
										{index + 1}.
									</span>
									<p className="text-gray-700">{section.title}</p>
								</div>
							))}
						</div>
					</div>

					{/* Disclaimer */}
					<div className="mb-8">
						<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
							<div className="flex items-center mb-3">
								<Info className="w-5 h-5 text-yellow-600 mr-2" />
								<h2 className="text-lg font-semibold text-yellow-800">
									Important Disclaimer
								</h2>
							</div>
							<p className="text-yellow-900 font-medium">
								This self-assessment test is designed only for practice and
								self-improvement purposes. The purpose of this test is to help
								students identify their strengths and areas of improvement.
							</p>
						</div>
					</div>

					{/* Important Notes */}
					<div className="mb-8">
						<h2 className="text-xl font-semibold text-gray-900 mb-4">
							Important Notes
						</h2>
						<div className="space-y-3">
							<div className="flex items-start space-x-3">
								<CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
								<p className="text-gray-700">
									Complete each section fully before proceeding to the next
								</p>
							</div>
							<div className="flex items-start space-x-3">
								<CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
								<p className="text-gray-700">
									Your answers are automatically saved as you progress
								</p>
							</div>
							{assessment.timeLimit && (
								<div className="flex items-start space-x-3">
									<AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
									<p className="text-gray-700">
										Assessment will be auto-submitted when time expires
									</p>
								</div>
							)}
							<div className="flex items-start space-x-3">
								<AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
								<p className="text-gray-700">
									Make sure to submit your assessment before leaving the page
								</p>
							</div>
						</div>
					</div>

					{/* Start Button */}
					<div className="text-center">
						<button
							onClick={() => setShowInstructions(false)}
							className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg">
							Start Assessment
						</button>
					</div>
				</div>
			</div>
		);
	}

	const currentSection = assessment.sections[currentSectionIndex];

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			{/* Header with Timer and Progress */}
			<div className="bg-white rounded-lg border border-gray-200 p-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<Link
							href="/student/assessments"
							className="text-gray-600 hover:text-gray-900">
							<ArrowLeft className="w-5 h-5" />
						</Link>
						<div>
							<h1 className="text-xl font-bold text-gray-900">
								{assessment.title}
							</h1>
							<p className="text-sm text-gray-600">
								Section {currentSectionIndex + 1} of{" "}
								{assessment.sections.length}: {currentSection.title}
							</p>
						</div>
					</div>

					<div className="flex items-center space-x-6">
						{/* Progress */}
						<div className="text-sm text-gray-600">
							<div className="font-medium">Progress</div>
							<div>
								{progress.answered} / {progress.total} answered
							</div>
							<div className="text-xs">
								{progress.answeredRequired} / {progress.required} required
							</div>
						</div>

						{/* Timer */}
						{timeRemaining !== null && (
							<div
								className={`flex items-center space-x-2 ${
									timeRemaining <= 300 ? "text-red-600" : "text-gray-600"
								}`}>
								<Clock className="w-5 h-5" />
								<div className="text-lg font-mono font-semibold">
									{formatTime(timeRemaining)}
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Progress Bar */}
				<div className="mt-4">
					<div className="flex space-x-1">
						{assessment.sections.map((section, index) => (
							<button
								key={section._id}
								onClick={() => setCurrentSectionIndex(index)}
								className={`flex-1 h-2 rounded ${
									index === currentSectionIndex
										? "bg-blue-600"
										: index < currentSectionIndex
										? "bg-green-500"
										: "bg-gray-200"
								}`}
								title={`Section ${index + 1}: ${section.title}`}
							/>
						))}
					</div>
					{/* Section Names */}
					<div className="flex space-x-1 mt-2">
						{assessment.sections.map((section, index) => (
							<div
								key={section._id}
								className={`flex-1 text-center text-xs ${
									index === currentSectionIndex
										? "text-blue-600 font-semibold"
										: "text-gray-500"
								}`}>
								{index + 1}. {section.title}
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Current Section */}
			<div className="bg-white rounded-lg border border-gray-200 p-6">
				<div className="mb-6">
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						{currentSection.title}
					</h2>
					{currentSection.description && (
						<p className="text-gray-600">{currentSection.description}</p>
					)}
				</div>

				{/* Questions */}
				<div className="space-y-8">
					{currentSection.questions.map((question, questionIndex) => (
						<div
							key={question._id}
							className="border border-gray-200 rounded-lg p-6">
							<div className="mb-4">
								<div className="flex items-start space-x-2">
									<span className="text-sm font-medium text-gray-500 mt-1">
										{currentSectionIndex + 1}.{questionIndex + 1}
									</span>
									<div className="flex-1">
										<h3 className="text-lg text-gray-900">
											{question.text}
											{question.isRequired && (
												<span className="text-red-500 ml-1">*</span>
											)}
										</h3>
									</div>
								</div>
							</div>

							{/* Rating Scale */}
							<div className="ml-8">
								<div className="flex items-center justify-between">
									{question.scaleOptions.labels.map((label, index) => {
										const scaleValue = question.scaleOptions.min + index;
										return (
											<label
												key={index}
												className="flex flex-col items-center space-y-2 cursor-pointer">
												<input
													type="radio"
													name={`question-${question._id}`}
													value={scaleValue}
													checked={answers[question._id] === scaleValue}
													onChange={() =>
														handleAnswerChange(question._id, scaleValue)
													}
													className="w-5 h-5 text-blue-600 focus:ring-blue-500"
												/>
												<span className="text-xs text-gray-600 text-center leading-tight max-w-20">
													{label}
												</span>
											</label>
										);
									})}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Navigation */}
			<div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
				<button
					onClick={() =>
						setCurrentSectionIndex((prev) => Math.max(0, prev - 1))
					}
					disabled={currentSectionIndex === 0}
					className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
					<ArrowLeft className="w-4 h-4 mr-2" />
					Previous Section
				</button>

				<div className="text-center">
					<div className="text-sm text-gray-600">
						Section {currentSectionIndex + 1} of {assessment.sections.length}
					</div>
					{!isCurrentSectionComplete() &&
						currentSectionIndex < assessment.sections.length - 1 && (
							<div className="text-xs text-orange-600 mt-1">
								Complete all required questions to proceed
							</div>
						)}
				</div>

				{currentSectionIndex === assessment.sections.length - 1 ? (
					<button
						onClick={() => handleSubmit(false)}
						disabled={
							submitting || progress.answeredRequired < progress.required
						}
						className="inline-flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium">
						<Send className="w-4 h-4 mr-2" />
						{submitting ? "Submitting..." : "Submit Assessment"}
					</button>
				) : (
					<button
						onClick={() =>
							setCurrentSectionIndex((prev) =>
								Math.min(assessment.sections.length - 1, prev + 1)
							)
						}
						disabled={!isCurrentSectionComplete()}
						className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400">
						Next Section
						<ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
					</button>
				)}
			</div>
		</div>
	);
}

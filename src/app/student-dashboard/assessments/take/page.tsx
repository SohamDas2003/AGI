"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import StudentSidebar from "@/components/dashboard/student-sidebar";
import Header from "@/components/dashboard/header";
import {
	Clock,
	ArrowLeft,
	ArrowRight,
	CheckCircle,
	AlertTriangle,
} from "lucide-react";

interface Question {
	id: string;
	text: string;
	category: string;
}

interface Assessment {
	id: string;
	title: string;
	description?: string;
	duration: number; // minutes
	questions: Question[];
}

interface Answer {
	questionId: string;
	value: number | null;
}

const scaleOptions = [
	{ value: 1, label: "Strongly Disagree" },
	{ value: 2, label: "Disagree" },
	{ value: 3, label: "Neutral" },
	{ value: 4, label: "Agree" },
	{ value: 5, label: "Strongly Agree" },
];

// Mock assessment as a fallback when no backend is present
const mockAssessment: Assessment = {
	id: "1",
	title: "Communication Skills Assessment",
	description: "Rate the statements on a 5-point scale",
	duration: 30,
	questions: Array.from({ length: 10 }).map((_, i) => ({
		id: `q${i + 1}`,
		text: [
			"I can express my ideas clearly in written form",
			"I am confident speaking in front of groups",
			"I can adapt my communication style to different audiences",
			"I listen actively and ask relevant questions",
			"I can present complex information in a simple manner",
			"I am comfortable participating in professional discussions",
			"I can write professional emails and documents effectively",
			"I can provide clear instructions and explanations",
			"I am confident in one-on-one conversations",
			"I can handle difficult conversations professionally",
		][i],
		category: "Communication Skills",
	})),
};

// Component that uses useSearchParams - needs to be wrapped in Suspense
function TakeAssessmentContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const assessmentId = searchParams?.get("id") || mockAssessment.id;

	const [assessment] = useState<Assessment>(mockAssessment);
	const [answers, setAnswers] = useState<Answer[]>([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [timeRemaining, setTimeRemaining] = useState(assessment.duration * 60);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showConfirmation, setShowConfirmation] = useState(false);

	// Initialize answers when assessment loads
	useEffect(() => {
		const initial = assessment.questions.map((q) => ({
			questionId: q.id,
			value: null,
		}));
		setAnswers(initial);
		setTimeRemaining(assessment.duration * 60);
		setCurrentQuestionIndex(0);
	}, [assessment]);

	// In a real app you'd fetch the assessment by id here.
	useEffect(() => {
		// placeholder: keep mockAssessment, could fetch from API using assessmentId
		if (assessmentId !== assessment.id) {
			// no-op for now
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [assessmentId]);

	// Timer
	const handleAutoSubmit = useCallback(() => {
		if (isSubmitting) return;
		setIsSubmitting(true);
		// Simulate submit and redirect
		setTimeout(() => {
			router.push("/student-dashboard/assessments");
		}, 1200);
	}, [isSubmitting, router]);

	// Timer
	useEffect(() => {
		const timer = setInterval(() => {
			setTimeRemaining((prev) => {
				if (prev <= 1) {
					handleAutoSubmit();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
		return () => clearInterval(timer);
	}, [handleAutoSubmit]);

	const handleAnswerChange = (questionId: string, value: number) => {
		setAnswers((prev) =>
			prev.map((a) => (a.questionId === questionId ? { ...a, value } : a))
		);
	};

	const handleNext = () =>
		setCurrentQuestionIndex((i) =>
			Math.min(i + 1, assessment.questions.length - 1)
		);
	const handlePrevious = () =>
		setCurrentQuestionIndex((i) => Math.max(i - 1, 0));

	const answeredCount = answers.filter((a) => a.value !== null).length;
	const currentQuestion = assessment.questions[currentQuestionIndex];
	const currentAnswer = answers.find(
		(a) => a.questionId === currentQuestion?.id
	);

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")} : ${secs
			.toString()
			.padStart(2, "0")}`;
	};

	const handleSubmit = async () => {
		if (isSubmitting) return;
		setIsSubmitting(true);
		// In real app send `answers` to backend
		console.log("Submitting answers:", answers);
		setTimeout(() => router.push("/student-dashboard/assessments"), 1200);
	};

	if (isSubmitting) {
		return (
			<div className="flex h-screen bg-gray-50">
				<StudentSidebar />
				<div className="flex-1 flex flex-col overflow-hidden">
					<Header />
					<main className="flex-1 flex items-center justify-center">
						<div className="text-center">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
							<h2 className="text-xl font-semibold text-gray-900">
								Submitting Assessment...
							</h2>
							<p className="text-gray-600 mt-2">Please wait</p>
						</div>
					</main>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-screen bg-gray-50">
			<StudentSidebar />
			<div className="flex-1 flex flex-col overflow-hidden">
				<Header />

				{/* Header */}
				<div className="bg-white border-b border-gray-200 px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<button
								onClick={() => router.back()}
								className="p-2 hover:bg-gray-100 rounded-lg">
								<ArrowLeft className="w-5 h-5 text-gray-600" />
							</button>
							<div>
								<h1 className="text-xl font-semibold text-gray-900">
									{assessment.title}
								</h1>
								{assessment.description && (
									<p className="text-sm text-gray-600">
										{assessment.description}
									</p>
								)}
							</div>
						</div>

						<div className="flex items-center space-x-4">
							<div
								className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${
									timeRemaining < 300
										? "bg-red-100 text-red-800"
										: "bg-blue-100 text-blue-800"
								}`}>
								<Clock className="w-4 h-4" />
								<span className="font-mono font-medium">
									{formatTime(timeRemaining)}
								</span>
							</div>
							<div className="text-sm text-gray-600">
								{answeredCount}/{assessment.questions.length} answered
							</div>
						</div>
					</div>
				</div>

				<main className="flex-1 overflow-y-auto p-6">
					<div className="max-w-4xl mx-auto">
						<div className="mb-6">
							<div className="flex justify-between text-sm text-gray-600 mb-2">
								<span>
									Question {currentQuestionIndex + 1} of{" "}
									{assessment.questions.length}
								</span>
								<span>
									{Math.round(
										((currentQuestionIndex + 1) / assessment.questions.length) *
											100
									)}
									% Complete
								</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-2">
								<div
									className="bg-blue-600 h-2 rounded-full"
									style={{
										width: `${
											((currentQuestionIndex + 1) /
												assessment.questions.length) *
											100
										}%`,
									}}
								/>
							</div>
						</div>

						<div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
							<div className="mb-6">
								<div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
									<span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
										{currentQuestion?.category}
									</span>
								</div>
								<h2 className="text-xl font-medium text-gray-900 leading-relaxed">
									{currentQuestion?.text}
								</h2>
							</div>

							<div className="space-y-3">
								<p className="text-sm font-medium text-gray-700 mb-4">
									Please rate how well this statement describes you:
								</p>
								{scaleOptions.map((option) => (
									<label
										key={option.value}
										className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
											currentAnswer?.value === option.value
												? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
												: "border-gray-200"
										}`}>
										<input
											type="radio"
											name={`question_${currentQuestion?.id}`}
											value={option.value}
											checked={currentAnswer?.value === option.value}
											onChange={() =>
												handleAnswerChange(currentQuestion.id, option.value)
											}
											className="sr-only"
										/>
										<div
											className={`w-4 h-4 rounded-full border-2 mr-3 flex-shrink-0 ${
												currentAnswer?.value === option.value
													? "border-blue-500 bg-blue-500"
													: "border-gray-300"
											}`}>
											{currentAnswer?.value === option.value && (
												<div className="w-full h-full rounded-full bg-white scale-50" />
											)}
										</div>
										<div className="flex-1">
											<div className="flex items-center justify-between">
												<span className="text-gray-900 font-medium">
													{option.value}
												</span>
												<span className="text-gray-600">{option.label}</span>
											</div>
										</div>
									</label>
								))}
							</div>
						</div>

						<div className="flex items-center justify-between">
							<button
								onClick={handlePrevious}
								disabled={currentQuestionIndex === 0}
								className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
									currentQuestionIndex === 0
										? "bg-gray-100 text-gray-400 cursor-not-allowed"
										: "bg-gray-200 text-gray-700 hover:bg-gray-300"
								}`}>
								<ArrowLeft className="w-4 h-4 mr-2" />
								Previous
							</button>

							<div className="flex items-center space-x-3">
								{currentQuestionIndex === assessment.questions.length - 1 ? (
									<button
										onClick={() => setShowConfirmation(true)}
										disabled={answeredCount !== assessment.questions.length}
										className={`flex items-center px-6 py-2 rounded-lg transition-colors duration-200 ${
											answeredCount === assessment.questions.length
												? "bg-green-600 text-white hover:bg-green-700"
												: "bg-gray-300 text-gray-500 cursor-not-allowed"
										}`}>
										<CheckCircle className="w-4 h-4 mr-2" />
										Submit Assessment
									</button>
								) : (
									<button
										onClick={handleNext}
										className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
										Next
										<ArrowRight className="w-4 h-4 ml-2" />
									</button>
								)}
							</div>
						</div>

						{answeredCount < assessment.questions.length && (
							<div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
								<div className="flex items-center">
									<AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
									<div>
										<p className="text-sm font-medium text-yellow-800">
											You have {assessment.questions.length - answeredCount}{" "}
											unanswered questions
										</p>
										<p className="text-sm text-yellow-700 mt-1">
											Please answer all questions before submitting the
											assessment.
										</p>
									</div>
								</div>
							</div>
						)}
					</div>
				</main>

				{/* Confirmation Modal */}
				{showConfirmation && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
						<div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
							<div className="text-center">
								<CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
								<h3 className="text-lg font-medium text-gray-900 mb-2">
									Submit Assessment?
								</h3>
								<p className="text-gray-600 mb-6">
									You have answered all {assessment.questions.length} questions.
									Once submitted, you cannot change your responses.
								</p>
								<div className="flex space-x-3 justify-center">
									<button
										onClick={() => setShowConfirmation(false)}
										className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
										Review Answers
									</button>
									<button
										onClick={handleSubmit}
										className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
										Submit Assessment
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default function TakeAssessmentPage() {
	return (
		<Suspense
			fallback={
				<div className="flex h-screen bg-gray-50">
					<StudentSidebar />
					<div className="flex-1 flex flex-col overflow-hidden">
						<Header />
						<main className="flex-1 flex items-center justify-center">
							<div className="text-center">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
								<h2 className="text-xl font-semibold text-gray-900">
									Loading Assessment...
								</h2>
							</div>
						</main>
					</div>
				</div>
			}>
			<TakeAssessmentContent />
		</Suspense>
	);
}

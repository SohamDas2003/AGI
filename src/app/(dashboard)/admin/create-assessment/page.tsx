"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	ArrowRight,
	CheckCircle,
	FileText,
	Users,
	Eye,
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

// Step components
import SectionsForm from "@/components/assessment/create/SectionsForm";
import PreviewForm from "@/components/assessment/create/PreviewForm";

// Local BasicDetailsForm component
import { Clock, Info, Settings, Target } from "lucide-react";

const COURSE_OPTIONS = [
	{ value: "MCA", label: "MCA (Master of Computer Applications)" },
	{ value: "MMS", label: "MMS (Master of Management Studies)" },
	{ value: "PGDM", label: "PGDM (Post Graduate Diploma in Management)" },
];

const PGDM_SPECIALIZATION_OPTIONS: (
	| "Marketing"
	| "Finance"
	| "Human Resources"
	| "Operations"
	| "Information Technology"
)[] = [
	"Marketing",
	"Finance",
	"Human Resources",
	"Operations",
	"Information Technology",
];

interface LocalBasicDetailsFormProps {
	formData: AssessmentFormData;
	updateFormData: (updates: Partial<AssessmentFormData>) => void;
}

function LocalBasicDetailsForm({
	formData,
	updateFormData,
}: LocalBasicDetailsFormProps) {
	const handleInputChange = (
		field: keyof AssessmentFormData,
		value: string | number | boolean | undefined
	) => {
		updateFormData({ [field]: value });
	};

	const toggleArrayValue = (field: "course", value: string) => {
		const currentArray = formData.criteria[field] as ("MCA" | "MMS" | "PGDM")[];
		const newArray = currentArray.includes(value as "MCA" | "MMS" | "PGDM")
			? currentArray.filter((item) => item !== value)
			: [...currentArray, value as "MCA" | "MMS" | "PGDM"];

		updateFormData({
			criteria: {
				...formData.criteria,
				[field]: newArray,
				pgdmSpecializations: newArray.includes("PGDM")
					? formData.criteria.pgdmSpecializations || []
					: [],
			},
		});
	};

	const togglePgdmSpecialization = (
		value:
			| "Marketing"
			| "Finance"
			| "Human Resources"
			| "Operations"
			| "Information Technology"
	) => {
		const current = formData.criteria.pgdmSpecializations || [];
		const next = current.includes(value)
			? current.filter((v) => v !== value)
			: [...current, value];
		updateFormData({
			criteria: { ...formData.criteria, pgdmSpecializations: next },
		});
	};

	return (
		<div className="space-y-6">
			{/* Basic Information */}
			<div className="bg-white p-6 rounded-lg border border-gray-200">
				<h3 className="text-lg font-medium text-gray-900 mb-4">
					<Info className="h-5 w-5 inline mr-2" />
					Basic Information
				</h3>

				<div className="grid grid-cols-1 gap-4">
					{/* Title */}
					<div>
						<label
							htmlFor="title"
							className="block text-sm font-medium text-gray-700 mb-2">
							Assessment Title *
						</label>
						<input
							type="text"
							id="title"
							value={formData.title}
							onChange={(e) => handleInputChange("title", e.target.value)}
							placeholder="Enter assessment title..."
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							required
						/>
					</div>

					{/* Description */}
					<div>
						<label
							htmlFor="description"
							className="block text-sm font-medium text-gray-700 mb-2">
							Description
						</label>
						<textarea
							id="description"
							value={formData.description}
							onChange={(e) => handleInputChange("description", e.target.value)}
							rows={3}
							placeholder="Provide a brief description of this assessment..."
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					{/* Instructions */}
					<div>
						<label
							htmlFor="instructions"
							className="block text-sm font-medium text-gray-700 mb-2">
							Instructions for Students
						</label>
						<textarea
							id="instructions"
							value={formData.instructions}
							onChange={(e) =>
								handleInputChange("instructions", e.target.value)
							}
							rows={3}
							placeholder="Provide detailed instructions for taking this assessment..."
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
				</div>
			</div>

			{/* Target Criteria */}
			<div className="bg-white p-6 rounded-lg border border-gray-200">
				<h3 className="text-lg font-medium text-gray-900 mb-4">
					<Target className="h-5 w-5 inline mr-2" />
					Student Target Criteria
				</h3>

				{/* Course Selection */}
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Target Courses *
					</label>
					<div className="space-y-2">
						{COURSE_OPTIONS.map((option) => (
							<label
								key={option.value}
								className="flex items-center">
								<input
									type="checkbox"
									checked={formData.criteria.course.includes(
										option.value as "MCA" | "MMS" | "PGDM"
									)}
									onChange={() => toggleArrayValue("course", option.value)}
									className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
								/>
								<span className="ml-2 text-sm text-gray-700">
									{option.label}
								</span>
							</label>
						))}
					</div>

					{/* PGDM Specializations - appears when PGDM is checked */}
					{formData.criteria.course.includes("PGDM") && (
						<div className="mt-4 pl-6 border-l-2 border-blue-200">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								PGDM Specializations{" "}
								<span className="text-gray-500 text-xs">
									(select one or more)
								</span>
							</label>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
								{PGDM_SPECIALIZATION_OPTIONS.map((spec) => (
									<label
										key={spec}
										className="flex items-center">
										<input
											type="checkbox"
											checked={(
												formData.criteria.pgdmSpecializations || []
											).includes(spec)}
											onChange={() => togglePgdmSpecialization(spec)}
											className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
										/>
										<span className="ml-2 text-sm text-gray-700">{spec}</span>
									</label>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Assessment Settings */}
			<div className="bg-white p-6 rounded-lg border border-gray-200">
				<h3 className="text-lg font-medium text-gray-900 mb-4">
					<Settings className="h-5 w-5 inline mr-2" />
					Assessment Settings
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Time Limit */}
					<div>
						<label
							htmlFor="timeLimit"
							className="block text-sm font-medium text-gray-700 mb-2">
							<Clock className="h-4 w-4 inline mr-1" />
							Time Limit (minutes)
						</label>
						<input
							type="number"
							id="timeLimit"
							value={formData.timeLimit || ""}
							onChange={(e) =>
								handleInputChange(
									"timeLimit",
									e.target.value ? parseInt(e.target.value) : undefined
								)
							}
							min="1"
							placeholder="No time limit"
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					{/* Multiple Attempts */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Multiple Attempts
						</label>
						<div className="space-y-2">
							<label className="flex items-center">
								<input
									type="checkbox"
									checked={formData.allowMultipleAttempts}
									onChange={(e) =>
										handleInputChange("allowMultipleAttempts", e.target.checked)
									}
									className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
								/>
								<span className="ml-2 text-sm text-gray-700">
									Allow multiple attempts
								</span>
							</label>

							{formData.allowMultipleAttempts && (
								<div className="mt-2">
									<label
										htmlFor="maxAttempts"
										className="block text-sm font-medium text-gray-700 mb-1">
										Maximum Attempts
									</label>
									<input
										type="number"
										id="maxAttempts"
										value={formData.maxAttempts || ""}
										onChange={(e) =>
											handleInputChange(
												"maxAttempts",
												e.target.value ? parseInt(e.target.value) : undefined
											)
										}
										min="1"
										max="10"
										className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Validation Messages */}
			{!formData.title && (
				<div className="text-red-600 text-sm">
					Please enter an assessment title.
				</div>
			)}
			{formData.criteria.course.length === 0 && (
				<div className="text-red-600 text-sm">
					Please select at least one target course.
				</div>
			)}
			{formData.criteria.course.includes("PGDM") &&
				(formData.criteria.pgdmSpecializations || []).length === 0 && (
					<div className="text-red-600 text-sm">
						Please select at least one PGDM specialization.
					</div>
				)}
		</div>
	);
}

// Types
export interface AssessmentFormData {
	title: string;
	description: string;
	criteria: {
		course: ("MCA" | "MMS" | "PGDM")[];
		pgdmSpecializations?: (
			| "Marketing"
			| "Finance"
			| "Human Resources"
			| "Operations"
			| "Information Technology"
		)[];
	};
	timeLimit?: number;
	instructions: string;
	allowMultipleAttempts: boolean;
	maxAttempts?: number;
	autoAssign: boolean;
	assignOnLogin: boolean;
	sections: {
		title: string;
		description?: string;
		questions: {
			text: string;
			isRequired: boolean;
			scaleOptions: {
				min: number;
				max: number;
				minLabel: string;
				maxLabel: string;
				labels: string[];
			};
		}[];
	}[];
}

const INITIAL_FORM_DATA: AssessmentFormData = {
	title: "",
	description: "",
	criteria: {
		course: [],
		pgdmSpecializations: [],
	},
	timeLimit: 60,
	instructions: "",
	allowMultipleAttempts: false,
	maxAttempts: 1,
	autoAssign: false,
	assignOnLogin: false,
	sections: [],
};

const STEPS = [
	{
		id: 1,
		title: "Basic Details",
		description: "Assessment information and settings",
		icon: FileText,
	},
	{
		id: 2,
		title: "Sections & Questions",
		description: "Add sections and questions",
		icon: Users,
	},
	{
		id: 3,
		title: "Preview & Create",
		description: "Review and create assessment",
		icon: Eye,
	},
];

function CreateAssessmentPage() {
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] =
		useState<AssessmentFormData>(INITIAL_FORM_DATA);
	const [isCreating, setIsCreating] = useState(false);

	const updateFormData = (updates: Partial<AssessmentFormData>) => {
		setFormData((prev) => ({ ...prev, ...updates }));
	};

	const nextStep = () => {
		if (currentStep < STEPS.length) {
			setCurrentStep(currentStep + 1);
		}
	};

	const prevStep = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleCreateAssessment = async () => {
		setIsCreating(true);
		try {
			console.log("Sending assessment data:", formData);

			const response = await fetch("/api/assessments", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include", // This ensures cookies are sent
				body: JSON.stringify(formData),
			});

			console.log("Response status:", response.status);
			console.log("Response headers:", response.headers);

			if (response.ok) {
				const responseData = await response.json();
				console.log("Assessment created successfully:", responseData);
				router.push("/admin/dashboard?success=assessment-created");
			} else {
				const error = await response.json();
				console.error("Error creating assessment:", error);
				alert(`Failed to create assessment: ${error.error || "Unknown error"}`);
			}
		} catch (error) {
			console.error("Network error creating assessment:", error);
			alert(
				"Network error: Failed to create assessment. Please check your connection and try again."
			);
		} finally {
			setIsCreating(false);
		}
	};

	const isStepValid = () => {
		switch (currentStep) {
			case 1:
				return (
					(formData.title || "").trim() !== "" &&
					formData.criteria.course.length > 0 &&
					(!formData.criteria.course.includes("PGDM") ||
						(!!formData.criteria.pgdmSpecializations &&
							formData.criteria.pgdmSpecializations.length > 0))
				);
			case 2:
				return (
					formData.sections.length > 0 &&
					formData.sections.every(
						(section) =>
							(section.title || "").trim() !== "" &&
							section.questions.length > 0
					)
				);
			case 3:
				return true;
			default:
				return false;
		}
	};

	const renderStepContent = () => {
		switch (currentStep) {
			case 1:
				return (
					<LocalBasicDetailsForm
						formData={formData}
						updateFormData={updateFormData}
					/>
				);
			case 2:
				return (
					<SectionsForm
						formData={formData}
						updateFormData={updateFormData}
					/>
				);
			case 3:
				return (
					<PreviewForm
						formData={formData}
						onCreateAssessment={handleCreateAssessment}
						isCreating={isCreating}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<ProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN"]}>
			<div className="min-h-screen bg-gray-50">
				<div className="bg-white shadow-sm border-b">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between h-16">
							<div className="flex items-center">
								<button
									onClick={() => router.back()}
									className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
									<ArrowLeft className="h-5 w-5" />
								</button>
								<h1 className="text-xl font-semibold text-gray-900">
									Create Assessment
								</h1>
							</div>
						</div>
					</div>
				</div>

				<div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
					{/* Progress Steps */}
					<div className="mb-8">
						<nav aria-label="Progress">
							<ol className="flex items-center">
								{STEPS.map((step, index) => (
									<li
										key={step.id}
										className={`relative ${
											index !== STEPS.length - 1 ? "pr-8 sm:pr-20" : ""
										}`}>
										{index !== STEPS.length - 1 && (
											<div
												className="absolute inset-0 flex items-center"
												aria-hidden="true">
												<div
													className={`h-0.5 w-full ${
														step.id < currentStep
															? "bg-blue-600"
															: "bg-gray-200"
													}`}
												/>
											</div>
										)}
										<div
											className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
												step.id === currentStep
													? "bg-blue-600 text-white"
													: step.id < currentStep
													? "bg-blue-600 text-white"
													: "bg-gray-200 text-gray-500"
											}`}>
											{step.id < currentStep ? (
												<CheckCircle className="h-5 w-5" />
											) : (
												<step.icon className="h-4 w-4" />
											)}
										</div>
										<div className="mt-2">
											<div
												className={`text-sm font-medium ${
													step.id === currentStep
														? "text-blue-600"
														: step.id < currentStep
														? "text-gray-900"
														: "text-gray-500"
												}`}>
												{step.title}
											</div>
											<div className="text-xs text-gray-500">
												{step.description}
											</div>
										</div>
									</li>
								))}
							</ol>
						</nav>
					</div>

					{/* Step Content */}
					<div className="bg-white rounded-lg shadow-sm border p-6">
						{renderStepContent()}
					</div>

					{/* Navigation Buttons */}
					<div className="mt-8 flex justify-between">
						<button
							onClick={prevStep}
							disabled={currentStep === 1}
							className={`flex items-center px-4 py-2 rounded-md ${
								currentStep === 1
									? "bg-gray-100 text-gray-400 cursor-not-allowed"
									: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
							}`}>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Previous
						</button>

						{currentStep < STEPS.length ? (
							<button
								onClick={nextStep}
								disabled={!isStepValid()}
								className={`flex items-center px-4 py-2 rounded-md ${
									isStepValid()
										? "bg-blue-600 text-white hover:bg-blue-700"
										: "bg-gray-100 text-gray-400 cursor-not-allowed"
								}`}>
								Next
								<ArrowRight className="h-4 w-4 ml-2" />
							</button>
						) : (
							<button
								onClick={handleCreateAssessment}
								disabled={isCreating || !isStepValid()}
								className={`flex items-center px-6 py-2 rounded-md ${
									isCreating || !isStepValid()
										? "bg-gray-100 text-gray-400 cursor-not-allowed"
										: "bg-green-600 text-white hover:bg-green-700"
								}`}>
								{isCreating ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
										Creating...
									</>
								) : (
									<>
										<CheckCircle className="h-4 w-4 mr-2" />
										Create Assessment
									</>
								)}
							</button>
						)}
					</div>
				</div>
			</div>
		</ProtectedRoute>
	);
}

export default CreateAssessmentPage;

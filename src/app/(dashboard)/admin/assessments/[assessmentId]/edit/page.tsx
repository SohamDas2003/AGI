"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
	ArrowLeft,
	ArrowRight,
	CheckCircle,
	FileText,
	Users,
	Eye,
	Save,
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

// Step components
import SectionsForm from "@/components/assessment/create/SectionsForm";
import PreviewForm from "@/components/assessment/create/PreviewForm";
import BasicDetailsForm from "@/components/assessment/create/BasicDetailsForm";

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
		id?: string;
		title: string;
		description?: string;
		questions: {
			id?: string;
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
		title: "Preview & Update",
		description: "Review and update assessment",
		icon: Eye,
	},
];

function EditAssessmentPage() {
	const router = useRouter();
	const params = useParams();
	const assessmentId = params.assessmentId as string;

	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] =
		useState<AssessmentFormData>(INITIAL_FORM_DATA);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadAssessment = async () => {
			try {
				setIsLoading(true);
				setError(null);
				const response = await fetch(`/api/assessments/${assessmentId}`, {
					credentials: "include",
				});

				if (response.ok) {
					const data = await response.json();
					const assessment = data.assessment;

					// Map the assessment data to form data
					setFormData({
						title: assessment.title || "",
						description: assessment.description || "",
						criteria: {
							course: assessment.criteria?.course || [],
							pgdmSpecializations:
								assessment.criteria?.pgdmSpecializations || [],
						},
						timeLimit: assessment.timeLimit,
						instructions: assessment.instructions || "",
						allowMultipleAttempts: assessment.allowMultipleAttempts || false,
						maxAttempts: assessment.maxAttempts || 1,
						autoAssign: assessment.autoAssign || false,
						assignOnLogin: assessment.assignOnLogin || false,
						sections:
							assessment.sections?.map(
								(section: {
									id: string;
									title: string;
									description?: string;
									questions?: {
										id: string;
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
								}) => ({
									id: section.id,
									title: section.title || "",
									description: section.description || "",
									questions:
										section.questions?.map(
											(question: {
												id: string;
												text: string;
												isRequired: boolean;
												scaleOptions: {
													min: number;
													max: number;
													minLabel: string;
													maxLabel: string;
													labels: string[];
												};
											}) => ({
												id: question.id,
												text: question.text || "",
												isRequired: question.isRequired || false,
												scaleOptions: question.scaleOptions || {
													min: 1,
													max: 5,
													minLabel: "Beginner",
													maxLabel: "Expert",
													labels: [
														"Beginner",
														"Elementary",
														"Intermediate",
														"Advanced",
														"Expert",
													],
												},
											})
										) || [],
								})
							) || [],
					});
				} else {
					const errorData = await response.json();
					setError(errorData.error || "Failed to load assessment");
				}
			} catch (error) {
				console.error("Error fetching assessment:", error);
				setError("Error loading assessment");
			} finally {
				setIsLoading(false);
			}
		};

		if (assessmentId) {
			loadAssessment();
		}
	}, [assessmentId]);

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

	const handleUpdateAssessment = async () => {
		setIsSaving(true);
		try {
			console.log("Updating assessment data:", formData);

			const response = await fetch(`/api/assessments/${assessmentId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(formData),
			});

			console.log("Response status:", response.status);

			if (response.ok) {
				const responseData = await response.json();
				console.log("Assessment updated successfully:", responseData);
				router.push(
					`/admin/assessments/${assessmentId}/details?success=assessment-updated`
				);
			} else {
				const error = await response.json();
				console.error("Error updating assessment:", error);
				alert(`Failed to update assessment: ${error.error || "Unknown error"}`);
			}
		} catch (error) {
			console.error("Network error updating assessment:", error);
			alert(
				"Network error: Failed to update assessment. Please check your connection and try again."
			);
		} finally {
			setIsSaving(false);
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
					<BasicDetailsForm
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
						onCreateAssessment={handleUpdateAssessment}
						isCreating={isSaving}
						isEditMode={true}
					/>
				);
			default:
				return null;
		}
	};

	if (isLoading) {
		return (
			<ProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN"]}>
				<div className="p-6">
					<div className="flex items-center justify-center min-h-[400px]">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
					</div>
				</div>
			</ProtectedRoute>
		);
	}

	if (error) {
		return (
			<ProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN"]}>
				<div className="p-6">
					<div className="flex items-center justify-center min-h-[400px]">
						<div className="text-center">
							<p className="text-red-600 mb-4">{error}</p>
							<button
								onClick={() => router.push("/admin/assessments")}
								className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
								Back to Assessments
							</button>
						</div>
					</div>
				</div>
			</ProtectedRoute>
		);
	}

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
									Edit Assessment
								</h1>
							</div>
							<div className="text-sm text-gray-500">
								Assessment ID: {assessmentId}
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
										<button
											onClick={() => setCurrentStep(step.id)}
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
										</button>
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
								onClick={handleUpdateAssessment}
								disabled={isSaving || !isStepValid()}
								className={`flex items-center px-6 py-2 rounded-md ${
									isSaving || !isStepValid()
										? "bg-gray-100 text-gray-400 cursor-not-allowed"
										: "bg-green-600 text-white hover:bg-green-700"
								}`}>
								{isSaving ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
										Saving...
									</>
								) : (
									<>
										<Save className="h-4 w-4 mr-2" />
										Update Assessment
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

export default EditAssessmentPage;

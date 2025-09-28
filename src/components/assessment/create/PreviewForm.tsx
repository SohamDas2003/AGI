import React from "react";
import {
	CheckCircle,
	Clock,
	Users,
	FileText,
	AlertTriangle,
} from "lucide-react";

interface Question {
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
	title: string;
	description?: string;
	questions: Question[];
}

interface AssessmentFormData {
	title: string;
	description: string;
	criteria: {
		course: ("MCA" | "MMS" | "PGDM")[];
	};
	timeLimit?: number;
	instructions: string;
	allowMultipleAttempts: boolean;
	maxAttempts?: number;
	autoAssign: boolean;
	assignOnLogin: boolean;
	sections: Section[];
}

interface PreviewFormProps {
	formData: AssessmentFormData;
	onCreateAssessment: () => void;
	isCreating: boolean;
}

function PreviewForm({
	formData,
	onCreateAssessment,
	isCreating,
}: PreviewFormProps) {
	const totalQuestions = formData.sections.reduce(
		(total, section) => total + section.questions.length,
		0
	);
	const requiredQuestions = formData.sections.reduce(
		(total, section) =>
			total + section.questions.filter((q) => q.isRequired).length,
		0
	);

	const getValidationErrors = () => {
		const errors: string[] = [];

		if (!(formData.title || "").trim()) {
			errors.push("Assessment title is required");
		}

		// Validate that at least one course is selected
		if (!(formData.criteria.course && formData.criteria.course.length > 0)) {
			errors.push("At least one target course is required");
		}

		if (formData.sections.length === 0) {
			errors.push("At least one section is required");
		}

		formData.sections.forEach((section, sectionIndex) => {
			if (!(section.title || "").trim()) {
				errors.push(`Section ${sectionIndex + 1} title is required`);
			}

			if (section.questions.length === 0) {
				errors.push(
					`Section ${sectionIndex + 1} must have at least one question`
				);
			}

			section.questions.forEach((question, questionIndex) => {
				if (!(question.text || "").trim()) {
					errors.push(
						`Section ${sectionIndex + 1}, Question ${
							questionIndex + 1
						} text is required`
					);
				}
			});
		});

		return errors;
	};

	const validationErrors = getValidationErrors();
	const isValid = validationErrors.length === 0;

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-lg font-medium text-gray-900 mb-4">
					Preview & Create Assessment
				</h2>
				<p className="text-sm text-gray-600 mb-6">
					Review your assessment details before creating it. Students will see
					the assessment exactly as shown below.
				</p>
			</div>

			{/* Validation Errors */}
			{!isValid && (
				<div className="bg-red-50 border border-red-200 rounded-md p-4">
					<div className="flex">
						<AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
						<div className="ml-3">
							<h3 className="text-sm font-medium text-red-800">
								Please fix the following issues before creating the assessment:
							</h3>
							<ul className="mt-2 text-sm text-red-700 list-disc pl-5">
								{validationErrors.map((error, index) => (
									<li key={index}>{error}</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			)}

			{/* Assessment Overview */}
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
				<h3 className="text-lg font-semibold text-blue-900 mb-4">
					Assessment Overview
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<div className="text-center">
						<div className="text-2xl font-bold text-blue-600">
							{formData.sections.length}
						</div>
						<div className="text-sm text-blue-800">Sections</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-blue-600">
							{totalQuestions}
						</div>
						<div className="text-sm text-blue-800">Total Questions</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-blue-600">
							{requiredQuestions}
						</div>
						<div className="text-sm text-blue-800">Required Questions</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-blue-600">
							{formData.timeLimit || "∞"}
						</div>
						<div className="text-sm text-blue-800">
							{formData.timeLimit ? "Minutes" : "No Limit"}
						</div>
					</div>
				</div>
			</div>

			{/* Assessment Preview */}
			<div className="bg-white border border-gray-200 rounded-lg p-6">
				<div className="text-center mb-6">
					<h1 className="text-2xl font-bold text-gray-900 mb-2">
						{formData.title || "Untitled Assessment"}
					</h1>
					{formData.description && (
						<p className="text-gray-600 max-w-2xl mx-auto">
							{formData.description}
						</p>
					)}
				</div>

				{/* Assessment Details */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
					<div className="flex items-center">
						<Users className="h-5 w-5 text-gray-400 mr-2" />
						<div>
							<div className="text-sm font-medium text-gray-900">Course</div>
							<div className="text-sm text-gray-600">
								{formData.criteria.course.join(", ")}
							</div>
						</div>
					</div>
					<div className="flex items-center">
						<FileText className="h-5 w-5 text-gray-400 mr-2" />
						<div>
							{/* batch removed - assessments apply to all batches for selected courses */}
							<div className="text-sm font-medium text-gray-900">Courses</div>
							<div className="text-sm text-gray-600">
								{formData.criteria.course.join(", ")}
							</div>
						</div>
					</div>
					<div className="flex items-center">
						<Clock className="h-5 w-5 text-gray-400 mr-2" />
						<div>
							<div className="text-sm font-medium text-gray-900">
								Time Limit
							</div>
							<div className="text-sm text-gray-600">
								{formData.timeLimit
									? `${formData.timeLimit} minutes`
									: "No limit"}
							</div>
						</div>
					</div>
				</div>

				{/* Instructions */}
				{formData.instructions && (
					<div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
						<h3 className="text-sm font-medium text-yellow-800 mb-2">
							Instructions
						</h3>
						<p className="text-sm text-yellow-700 whitespace-pre-wrap">
							{formData.instructions}
						</p>
					</div>
				)}

				{/* Multiple Attempts Info */}
				{formData.allowMultipleAttempts && (
					<div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
						<p className="text-sm text-green-700">
							Students can take this assessment up to{" "}
							{formData.maxAttempts || 1} times.
						</p>
					</div>
				)}

				{/* Sections Preview */}
				<div className="space-y-6">
					{formData.sections.map((section, sectionIndex) => (
						<div
							key={sectionIndex}
							className="border border-gray-200 rounded-lg">
							<div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
								<h3 className="text-lg font-medium text-gray-900">
									{section.title || `Section ${sectionIndex + 1}`}
								</h3>
								{section.description && (
									<p className="text-sm text-gray-600 mt-1">
										{section.description}
									</p>
								)}
							</div>

							<div className="p-4 space-y-4">
								{section.questions.map((question, questionIndex) => (
									<div
										key={questionIndex}
										className="border-b border-gray-100 pb-4 last:border-b-0">
										<div className="flex items-start justify-between mb-3">
											<h4 className="text-sm font-medium text-gray-900">
												{questionIndex + 1}. {question.text || "Question text"}
												{question.isRequired && (
													<span className="text-red-500 ml-1">*</span>
												)}
											</h4>
										</div>

										{/* Scale Preview */}
										<div className="ml-4">
											<div className="flex items-center justify-between mb-2">
												<span className="text-xs text-gray-500">
													{question.scaleOptions.minLabel}
												</span>
												<span className="text-xs text-gray-500">
													{question.scaleOptions.maxLabel}
												</span>
											</div>
											<div className="flex items-center justify-between">
												{question.scaleOptions.labels.map((label, index) => (
													<div
														key={index}
														className="text-center">
														<div className="w-8 h-8 border-2 border-gray-300 rounded-full mb-1 flex items-center justify-center hover:border-blue-500 cursor-pointer transition-colors">
															<span className="text-xs text-gray-600">
																{index + 1}
															</span>
														</div>
														<span className="text-xs text-gray-500 block w-16 truncate">
															{label}
														</span>
													</div>
												))}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Create Button */}
			<div className="flex justify-center">
				<button
					onClick={onCreateAssessment}
					disabled={!isValid || isCreating}
					className={`flex items-center px-8 py-3 rounded-lg font-medium ${
						isValid && !isCreating
							? "bg-green-600 text-white hover:bg-green-700"
							: "bg-gray-300 text-gray-500 cursor-not-allowed"
					}`}>
					{isCreating ? (
						<>
							<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
							Creating Assessment...
						</>
					) : (
						<>
							<CheckCircle className="h-5 w-5 mr-2" />
							Create Assessment
						</>
					)}
				</button>
			</div>

			{/* Final Notes */}
			<div className="bg-gray-50 border border-gray-200 rounded-md p-4">
				<h3 className="text-sm font-medium text-gray-900 mb-2">
					What happens next?
				</h3>
				<ul className="text-sm text-gray-600 space-y-1">
					<li>• The assessment will be created and saved as a draft</li>
					<li>
						• You can assign it to students from the assessments dashboard
					</li>
					<li>
						• Students will be able to see and take the assessment once assigned
					</li>
					<li>• You can view responses and analytics in real-time</li>
				</ul>
			</div>
		</div>
	);
}

export default PreviewForm;

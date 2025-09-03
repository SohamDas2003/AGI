import React from "react";
import { CreateAssessmentForm } from "@/types";

interface AssessmentPreviewProps {
	form: CreateAssessmentForm;
}

const AssessmentPreview: React.FC<AssessmentPreviewProps> = ({ form }) => {
	const allQuestions = Object.entries(form.questions).flatMap(
		([category, questions]) =>
			questions.map((q, index) => ({
				...q,
				categoryLabel:
					category === "domainSkills"
						? "Domain Skills"
						: category === "digital"
						? "Digital Skills"
						: category === "interpersonal"
						? "Interpersonal Skills"
						: category === "communication"
						? "Communication Skills"
						: "Problem Solving",
				questionNumber: index + 1,
			}))
	);

	const scaleOptions = [
		{ value: 1, label: "Strongly Disagree" },
		{ value: 2, label: "Disagree" },
		{ value: 3, label: "Neutral" },
		{ value: 4, label: "Agree" },
		{ value: 5, label: "Strongly Agree" },
	];

	if (!form.title || allQuestions.filter((q) => q.text.trim()).length === 0) {
		return (
			<div className="text-center text-gray-500 py-8">
				<p>Fill in the basic information and questions to see the preview</p>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-lg p-6">
			{/* Assessment Header */}
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-gray-900 mb-2">{form.title}</h1>
				{form.description && (
					<p className="text-gray-600 mb-4">{form.description}</p>
				)}
				<div className="flex flex-wrap gap-4 text-sm text-gray-600">
					{form.course && (
						<span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
							Course: {form.course}
						</span>
					)}
					{form.batch && (
						<span className="bg-green-100 text-green-800 px-2 py-1 rounded">
							Batch: {form.batch}
						</span>
					)}
					<span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
						{allQuestions.filter((q) => q.text.trim()).length} Questions
					</span>
				</div>
			</div>

			{/* Instructions */}
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
				<h3 className="font-medium text-blue-900 mb-2">Instructions</h3>
				<p className="text-sm text-blue-800">
					Please rate each statement based on how well it describes you. Use the
					5-point scale where:
				</p>
				<div className="flex justify-between text-xs text-blue-700 mt-2">
					<span>1 = Strongly Disagree</span>
					<span>2 = Disagree</span>
					<span>3 = Neutral</span>
					<span>4 = Agree</span>
					<span>5 = Strongly Agree</span>
				</div>
			</div>

			{/* Questions by Category */}
			{Object.entries(form.questions).map(([category, questions]) => {
				const categoryLabel =
					category === "domainSkills"
						? "Domain Skills"
						: category === "digital"
						? "Digital Skills"
						: category === "interpersonal"
						? "Interpersonal Skills"
						: category === "communication"
						? "Communication Skills"
						: "Problem Solving";

				const validQuestions = questions.filter((q) => q.text.trim());

				if (validQuestions.length === 0) return null;

				return (
					<div
						key={category}
						className="mb-8">
						<h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
							{categoryLabel}
						</h3>
						<div className="space-y-4">
							{validQuestions.map((question, index) => (
								<div
									key={question.id}
									className="border border-gray-200 rounded-lg p-4">
									<div className="mb-3">
										<span className="text-sm font-medium text-gray-600">
											Question {index + 1}
										</span>
										<p className="text-gray-900 mt-1">{question.text}</p>
									</div>
									<div className="flex flex-wrap gap-2">
										{scaleOptions.map((option) => (
											<label
												key={option.value}
												className="flex items-center cursor-pointer">
												<input
													type="radio"
													name={`question_${question.id}`}
													value={option.value}
													className="mr-2 text-blue-600"
													disabled
												/>
												<span className="text-sm text-gray-700">
													{option.value} - {option.label}
												</span>
											</label>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				);
			})}

			{allQuestions.filter((q) => q.text.trim()).length === 0 && (
				<div className="text-center text-gray-500 py-8">
					<p>No questions have been added yet</p>
				</div>
			)}
		</div>
	);
};

export default AssessmentPreview;

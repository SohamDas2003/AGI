import React, { useState } from "react";
import { Plus, Trash2, Move, ChevronDown, ChevronUp } from "lucide-react";

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
	sections: Section[];
}

interface SectionsFormProps {
	formData: AssessmentFormData;
	updateFormData: (updates: Partial<AssessmentFormData>) => void;
}

const createNewQuestion = (): Question => ({
	text: "",
	isRequired: true,
	scaleOptions: {
		min: 1,
		max: 5,
		minLabel: "Strongly Disagree",
		maxLabel: "Strongly Agree",
		labels: [
			"Strongly Disagree",
			"Disagree",
			"Neutral",
			"Agree",
			"Strongly Agree",
		],
	},
});

const createNewSection = (): Section => ({
	title: "",
	description: "",
	questions: [],
});

function SectionsForm({ formData, updateFormData }: SectionsFormProps) {
	const [expandedSections, setExpandedSections] = useState<number[]>([]);

	const addSection = () => {
		const newSections = [...formData.sections, createNewSection()];
		updateFormData({ sections: newSections });
		setExpandedSections([...expandedSections, newSections.length - 1]);
	};

	const removeSection = (sectionIndex: number) => {
		const newSections = formData.sections.filter(
			(_, index) => index !== sectionIndex
		);
		updateFormData({ sections: newSections });
		setExpandedSections(
			expandedSections.filter((index) => index !== sectionIndex)
		);
	};

	const updateSection = (sectionIndex: number, updates: Partial<Section>) => {
		const newSections = [...formData.sections];
		newSections[sectionIndex] = { ...newSections[sectionIndex], ...updates };
		updateFormData({ sections: newSections });
	};

	const addQuestion = (sectionIndex: number) => {
		const newSections = [...formData.sections];
		newSections[sectionIndex].questions.push(createNewQuestion());
		updateFormData({ sections: newSections });
	};

	const removeQuestion = (sectionIndex: number, questionIndex: number) => {
		const newSections = [...formData.sections];
		newSections[sectionIndex].questions = newSections[
			sectionIndex
		].questions.filter((_, index) => index !== questionIndex);
		updateFormData({ sections: newSections });
	};

	const updateQuestion = (
		sectionIndex: number,
		questionIndex: number,
		updates: Partial<Question>
	) => {
		const newSections = [...formData.sections];
		newSections[sectionIndex].questions[questionIndex] = {
			...newSections[sectionIndex].questions[questionIndex],
			...updates,
		};
		updateFormData({ sections: newSections });
	};

	const toggleSectionExpanded = (sectionIndex: number) => {
		if (expandedSections.includes(sectionIndex)) {
			setExpandedSections(
				expandedSections.filter((index) => index !== sectionIndex)
			);
		} else {
			setExpandedSections([...expandedSections, sectionIndex]);
		}
	};

	const moveSectionUp = (sectionIndex: number) => {
		if (sectionIndex === 0) return;
		const newSections = [...formData.sections];
		[newSections[sectionIndex - 1], newSections[sectionIndex]] = [
			newSections[sectionIndex],
			newSections[sectionIndex - 1],
		];
		updateFormData({ sections: newSections });
	};

	const moveSectionDown = (sectionIndex: number) => {
		if (sectionIndex === formData.sections.length - 1) return;
		const newSections = [...formData.sections];
		[newSections[sectionIndex], newSections[sectionIndex + 1]] = [
			newSections[sectionIndex + 1],
			newSections[sectionIndex],
		];
		updateFormData({ sections: newSections });
	};

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-lg font-medium text-gray-900 mb-4">
					Assessment Sections & Questions
				</h2>
				<p className="text-sm text-gray-600 mb-6">
					Organize your assessment into sections and add questions with 5-point
					scale responses.
				</p>
			</div>

			{formData.sections.length === 0 ? (
				<div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						No sections yet
					</h3>
					<p className="text-gray-600 mb-4">
						Start by adding your first section to organize your assessment
						questions.
					</p>
					<button
						onClick={addSection}
						className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
						<Plus className="h-4 w-4 mr-2" />
						Add First Section
					</button>
				</div>
			) : (
				<div className="space-y-4">
					{formData.sections.map((section, sectionIndex) => (
						<div
							key={sectionIndex}
							className="bg-white border border-gray-200 rounded-lg">
							{/* Section Header */}
							<div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-3">
										<button
											onClick={() => toggleSectionExpanded(sectionIndex)}
											className="p-1 rounded hover:bg-gray-200">
											{expandedSections.includes(sectionIndex) ? (
												<ChevronUp className="h-4 w-4" />
											) : (
												<ChevronDown className="h-4 w-4" />
											)}
										</button>
										<h3 className="text-base font-medium text-gray-900">
											Section {sectionIndex + 1}:{" "}
											{section.title || "Untitled Section"}
										</h3>
										<span className="text-sm text-gray-500">
											({section.questions.length} questions)
										</span>
									</div>
									<div className="flex items-center space-x-2">
										<button
											onClick={() => moveSectionUp(sectionIndex)}
											disabled={sectionIndex === 0}
											className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
											<Move className="h-4 w-4 transform rotate-180" />
										</button>
										<button
											onClick={() => moveSectionDown(sectionIndex)}
											disabled={sectionIndex === formData.sections.length - 1}
											className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
											<Move className="h-4 w-4" />
										</button>
										<button
											onClick={() => removeSection(sectionIndex)}
											className="p-1 rounded hover:bg-red-100 text-red-600">
											<Trash2 className="h-4 w-4" />
										</button>
									</div>
								</div>
							</div>

							{/* Section Content */}
							{expandedSections.includes(sectionIndex) && (
								<div className="p-4 space-y-4">
									{/* Section Details */}
									<div className="grid grid-cols-1 gap-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Section Title *
											</label>
											<input
												type="text"
												value={section.title}
												onChange={(e) =>
													updateSection(sectionIndex, { title: e.target.value })
												}
												placeholder="e.g., Technical Skills, Communication Skills"
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Section Description
											</label>
											<textarea
												value={section.description}
												onChange={(e) =>
													updateSection(sectionIndex, {
														description: e.target.value,
													})
												}
												placeholder="Brief description of this section..."
												rows={2}
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
											/>
										</div>
									</div>

									{/* Questions */}
									<div>
										<div className="flex items-center justify-between mb-3">
											<h4 className="text-sm font-medium text-gray-900">
												Questions
											</h4>
											<button
												onClick={() => addQuestion(sectionIndex)}
												className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
												<Plus className="h-3 w-3 mr-1" />
												Add Question
											</button>
										</div>

										{section.questions.length === 0 ? (
											<div className="text-center py-6 bg-gray-50 rounded border">
												<p className="text-gray-500 text-sm">
													No questions added yet
												</p>
											</div>
										) : (
											<div className="space-y-3">
												{section.questions.map((question, questionIndex) => (
													<div
														key={questionIndex}
														className="bg-gray-50 border border-gray-200 rounded-md p-3">
														<div className="flex items-start justify-between mb-2">
															<span className="text-sm font-medium text-gray-700">
																Question {questionIndex + 1}
															</span>
															<button
																onClick={() =>
																	removeQuestion(sectionIndex, questionIndex)
																}
																className="p-1 rounded hover:bg-red-100 text-red-600">
																<Trash2 className="h-3 w-3" />
															</button>
														</div>

														<div className="space-y-3">
															<textarea
																value={question.text}
																onChange={(e) =>
																	updateQuestion(sectionIndex, questionIndex, {
																		text: e.target.value,
																	})
																}
																placeholder="Enter your question here..."
																rows={2}
																className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
															/>

															<div className="flex items-center">
																<input
																	type="checkbox"
																	checked={question.isRequired}
																	onChange={(e) =>
																		updateQuestion(
																			sectionIndex,
																			questionIndex,
																			{ isRequired: e.target.checked }
																		)
																	}
																	className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
																/>
																<label className="ml-2 text-sm text-gray-700">
																	Required question
																</label>
															</div>

															{/* Scale Preview */}
															<div className="bg-white border border-gray-200 rounded p-3">
																<p className="text-xs text-gray-600 mb-2">
																	Scale Preview:
																</p>
																<div className="flex items-center justify-between text-xs text-gray-500">
																	<span>{question.scaleOptions.minLabel}</span>
																	<div className="flex space-x-2">
																		{question.scaleOptions.labels.map(
																			(label, index) => (
																				<div
																					key={index}
																					className="text-center">
																					<div className="w-6 h-6 border border-gray-300 rounded-full mb-1"></div>
																					<span className="text-xs">
																						{index + 1}
																					</span>
																				</div>
																			)
																		)}
																	</div>
																	<span>{question.scaleOptions.maxLabel}</span>
																</div>
															</div>
														</div>
													</div>
												))}
											</div>
										)}
									</div>
								</div>
							)}
						</div>
					))}

					{/* Add Section Button */}
					<button
						onClick={addSection}
						className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors">
						<Plus className="h-4 w-4 inline mr-2" />
						Add Another Section
					</button>
				</div>
			)}

			{/* Summary */}
			{formData.sections.length > 0 && (
				<div className="bg-blue-50 border border-blue-200 rounded-md p-4">
					<h3 className="text-sm font-medium text-blue-800 mb-2">
						Assessment Summary
					</h3>
					<div className="text-sm text-blue-700">
						<p>Total Sections: {formData.sections.length}</p>
						<p>
							Total Questions:{" "}
							{formData.sections.reduce(
								(total, section) => total + section.questions.length,
								0
							)}
						</p>
						<p>
							Required Questions:{" "}
							{formData.sections.reduce(
								(total, section) =>
									total + section.questions.filter((q) => q.isRequired).length,
								0
							)}
						</p>
					</div>
				</div>
			)}
		</div>
	);
}

export default SectionsForm;

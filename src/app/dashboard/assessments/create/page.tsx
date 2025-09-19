"use client";

import React, { useState } from "react";
import AssessmentPreview from "@/components/assessment/assessment-preview";
import { ArrowLeft, Save, Plus, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import {
	CreateAssessmentForm,
	CreateAssessmentQuestion,
	SkillCategory,
} from "@/types";

const courses = [
	{ value: "", label: "Select Course" },
	{ value: "MCA", label: "MCA - Master of Computer Applications" },
	{ value: "MMS", label: "MMS - Master of Management Studies" },
	{ value: "PGDM", label: "PGDM - Post Graduate Diploma in Management" },
	{ value: "ALL", label: "All Courses" },
];

const batches = [
	{ value: "", label: "Select Batch" },
	{ value: "2024-26", label: "2024-26" },
	{ value: "2025-27", label: "2025-27" },
];

const skillCategories: SkillCategory[] = [
	{
		key: "domainSkills",
		label: "Domain Skills",
		description: "Technical and field-specific knowledge",
	},
	{
		key: "digital",
		label: "Digital Skills",
		description: "Digital literacy and technology proficiency",
	},
	{
		key: "interpersonal",
		label: "Interpersonal Skills",
		description: "Social and relationship building abilities",
	},
	{
		key: "communication",
		label: "Communication Skills",
		description: "Verbal and written communication abilities",
	},
	{
		key: "problemSolving",
		label: "Problem Solving",
		description: "Analytical and critical thinking skills",
	},
];

const sampleQuestions = {
	domainSkills: [
		"I have strong technical skills relevant to my field of study",
		"I can apply theoretical knowledge to practical situations effectively",
		"I stay updated with the latest developments in my domain",
		"I can work with industry-standard tools and technologies",
		"I understand the core concepts in my specialization area",
		"I can troubleshoot technical problems independently",
		"I have hands-on experience with relevant software/tools",
		"I can explain complex technical concepts clearly",
		"I follow best practices in my field of expertise",
		"I can adapt to new technologies and tools quickly",
	],
	digital: [
		"I am comfortable using various digital platforms and tools",
		"I can learn new software applications quickly",
		"I understand basic data analysis and interpretation",
		"I am proficient in using office productivity suites",
		"I can effectively use online collaboration tools",
		"I understand digital security and privacy best practices",
		"I can create and manage digital content effectively",
		"I am comfortable with cloud-based applications",
		"I can troubleshoot common digital/technical issues",
		"I stay updated with digital trends and technologies",
	],
	interpersonal: [
		"I work well in team environments",
		"I can build rapport with colleagues easily",
		"I am comfortable networking with professionals",
		"I can handle conflicts in a constructive manner",
		"I show empathy and understanding towards others",
		"I can provide constructive feedback to team members",
		"I am comfortable working with people from diverse backgrounds",
		"I can motivate and influence others positively",
		"I listen actively to others' perspectives",
		"I can collaborate effectively on group projects",
	],
	communication: [
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
	],
	problemSolving: [
		"I can break down complex problems into manageable parts",
		"I think critically before making decisions",
		"I can identify multiple solutions to a given problem",
		"I am comfortable working with ambiguous situations",
		"I can analyze data to make informed decisions",
		"I seek input from others when solving complex problems",
		"I can prioritize tasks effectively when under pressure",
		"I learn from my mistakes and apply those lessons",
		"I can think creatively to find innovative solutions",
		"I remain calm and focused when facing challenges",
	],
};

const generateEmptyQuestion = (
	category: string,
	text: string = ""
): CreateAssessmentQuestion => ({
	id: `${category}_${Date.now()}_${Math.random()}`,
	text: text,
	category: category as CreateAssessmentQuestion["category"],
});

const generateEmptyQuestions = (
	category: keyof typeof sampleQuestions
): CreateAssessmentQuestion[] => {
	return sampleQuestions[category].map((questionText) =>
		generateEmptyQuestion(category, questionText)
	);
};

export default function CreateAssessmentPage() {
	const [form, setForm] = useState<CreateAssessmentForm>({
		title: "",
		description: "",
		course: "",
		batch: "",
		questions: {
			domainSkills: generateEmptyQuestions("domainSkills"),
			digital: generateEmptyQuestions("digital"),
			interpersonal: generateEmptyQuestions("interpersonal"),
			communication: generateEmptyQuestions("communication"),
			problemSolving: generateEmptyQuestions("problemSolving"),
		},
	});

	const [activeTab, setActiveTab] = useState("basic");

	const handleInputChange = (
		field: keyof CreateAssessmentForm,
		value: string
	) => {
		setForm((prev: CreateAssessmentForm) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleQuestionChange = (
		category: keyof typeof form.questions,
		questionIndex: number,
		value: string
	) => {
		setForm((prev: CreateAssessmentForm) => ({
			...prev,
			questions: {
				...prev.questions,
				[category]: prev.questions[category].map(
					(q: CreateAssessmentQuestion, index: number) =>
						index === questionIndex ? { ...q, text: value } : q
				),
			},
		}));
	};

	const addQuestion = (category: keyof typeof form.questions) => {
		setForm((prev: CreateAssessmentForm) => ({
			...prev,
			questions: {
				...prev.questions,
				[category]: [
					...prev.questions[category],
					generateEmptyQuestion(category, ""),
				],
			},
		}));
	};

	const removeQuestion = (
		category: keyof typeof form.questions,
		questionIndex: number
	) => {
		if (form.questions[category].length > 1) {
			setForm((prev: CreateAssessmentForm) => ({
				...prev,
				questions: {
					...prev.questions,
					[category]: prev.questions[category].filter(
						(_: CreateAssessmentQuestion, index: number) =>
							index !== questionIndex
					),
				},
			}));
		}
	};

	const handleSave = () => {
		// Validation
		if (!form.title.trim()) {
			alert("Please enter an assessment title");
			return;
		}

		if (!form.course) {
			alert("Please select a course");
			return;
		}

		if (!form.batch) {
			alert("Please select a batch");
			return;
		}

		// Check if at least some questions are filled
		const totalFilledQuestions = Object.values(form.questions)
			.flat()
			.filter((q) => q.text.trim()).length;

		if (totalFilledQuestions === 0) {
			alert("Please add at least one question");
			return;
		}

		// Here you would typically send the data to your backend
		console.log("Assessment data:", form);
		alert(
			`Assessment "${form.title}" created successfully with ${totalFilledQuestions} questions!`
		);
	};

	const totalQuestions = Object.values(form.questions).reduce(
		(total: number, questions: CreateAssessmentQuestion[]) =>
			total + questions.length,
		0
	);
	const filledQuestions = Object.values(form.questions)
		.flat()
		.filter((q) => q.text.trim()).length;
	const isFormValid =
		form.title.trim() && form.course && form.batch && filledQuestions > 0;

	return (
		<div className="max-w-5xl mx-auto space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<Link
						href="/dashboard/assessments"
						className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
						<ArrowLeft className="w-5 h-5 text-gray-600" />
					</Link>
					<div>
						<h1 className="text-3xl font-bold text-gray-900">
							Create Assessment
						</h1>
						<p className="text-gray-600 mt-1">
							Design a comprehensive placement assessment
						</p>
					</div>
				</div>
				<button
					onClick={handleSave}
					disabled={!isFormValid}
					className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
						isFormValid
							? "bg-blue-600 text-white hover:bg-blue-700"
							: "bg-gray-300 text-gray-500 cursor-not-allowed"
					}`}>
					<Save className="w-4 h-4 mr-2" />
					Save Assessment
				</button>
			</div>

			{/* Tabs */}
			<div className="bg-white rounded-lg border border-gray-200">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						<button
							onClick={() => setActiveTab("basic")}
							className={`py-4 px-1 border-b-2 font-medium text-sm ${
								activeTab === "basic"
									? "border-blue-500 text-blue-600"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
							}`}>
							Basic Information
						</button>
						<button
							onClick={() => setActiveTab("questions")}
							className={`py-4 px-1 border-b-2 font-medium text-sm ${
								activeTab === "questions"
									? "border-blue-500 text-blue-600"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
							}`}>
							Questions ({totalQuestions})
						</button>
						<button
							onClick={() => setActiveTab("preview")}
							className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
								activeTab === "preview"
									? "border-blue-500 text-blue-600"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
							}`}>
							<Eye className="w-4 h-4 mr-1" />
							Preview
						</button>
					</nav>
				</div>

				<div className="p-6">
					{activeTab === "basic" && (
						<div className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Assessment Title *
									</label>
									<input
										type="text"
										value={form.title}
										onChange={(e) => handleInputChange("title", e.target.value)}
										placeholder="Enter assessment title"
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Course *
									</label>
									<select
										value={form.course}
										onChange={(e) =>
											handleInputChange("course", e.target.value)
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
										{courses.map((course) => (
											<option
												key={course.value}
												value={course.value}>
												{course.label}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Batch *
									</label>
									<select
										value={form.batch}
										onChange={(e) => handleInputChange("batch", e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
										{batches.map((batch) => (
											<option
												key={batch.value}
												value={batch.value}>
												{batch.label}
											</option>
										))}
									</select>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Description
								</label>
								<textarea
									value={form.description}
									onChange={(e) =>
										handleInputChange("description", e.target.value)
									}
									placeholder="Enter assessment description"
									rows={4}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
							</div>
						</div>
					)}

					{activeTab === "questions" && (
						<div className="space-y-8">
							{skillCategories.map((category) => (
								<div
									key={category.key}
									className="border border-gray-200 rounded-lg p-4">
									<div className="flex justify-between items-center mb-4">
										<div>
											<h3 className="text-lg font-medium text-gray-900">
												{category.label}
											</h3>
											<p className="text-sm text-gray-600">
												{category.description}
											</p>
										</div>
										<button
											onClick={() =>
												addQuestion(category.key as keyof typeof form.questions)
											}
											className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200">
											<Plus className="w-4 h-4 mr-1" />
											Add Question
										</button>
									</div>

									<div className="space-y-3">
										{form.questions[
											category.key as keyof typeof form.questions
										].map(
											(question: CreateAssessmentQuestion, index: number) => (
												<div
													key={question.id}
													className="flex items-center space-x-3">
													<div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
														{index + 1}
													</div>
													<input
														type="text"
														value={question.text}
														onChange={(e) =>
															handleQuestionChange(
																category.key as keyof typeof form.questions,
																index,
																e.target.value
															)
														}
														placeholder={`Enter ${category.label.toLowerCase()} question`}
														className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
													/>
													{form.questions[
														category.key as keyof typeof form.questions
													].length > 1 && (
														<button
															onClick={() =>
																removeQuestion(
																	category.key as keyof typeof form.questions,
																	index
																)
															}
															className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200">
															<Trash2 className="w-4 h-4" />
														</button>
													)}
												</div>
											)
										)}
									</div>

									<div className="mt-4 p-3 bg-gray-50 rounded-lg">
										<p className="text-sm text-gray-600">
											<strong>Response Scale:</strong> Each question will be
											answered on a 5-point scale:
										</p>
										<div className="flex justify-between text-xs text-gray-500 mt-1">
											<span>1 - Strongly Disagree</span>
											<span>2 - Disagree</span>
											<span>3 - Neutral</span>
											<span>4 - Agree</span>
											<span>5 - Strongly Agree</span>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
					{activeTab === "preview" && (
						<div className="space-y-6">
							<div className="mb-4">
								<h3 className="text-lg font-medium text-gray-900 mb-2">
									Assessment Preview
								</h3>
								<p className="text-sm text-gray-600">
									This is how the assessment will appear to students
								</p>
							</div>
							<AssessmentPreview form={form} />
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

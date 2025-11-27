import React from "react";
import { Clock, Info, Settings, Target } from "lucide-react";

interface AssessmentFormData {
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
}

interface BasicDetailsFormProps {
	formData: AssessmentFormData;
	updateFormData: (updates: Partial<AssessmentFormData>) => void;
}

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

function BasicDetailsForm({ formData, updateFormData }: BasicDetailsFormProps) {
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

				{/* Assessment Title */}
				<div className="mb-4">
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

				{/* Assessment Description */}
				<div className="mb-4">
					<label
						htmlFor="description"
						className="block text-sm font-medium text-gray-700 mb-2">
						Description
					</label>
					<textarea
						id="description"
						value={formData.description}
						onChange={(e) => handleInputChange("description", e.target.value)}
						rows={4}
						placeholder="Describe the purpose and content of this assessment..."
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
						onChange={(e) => handleInputChange("instructions", e.target.value)}
						rows={3}
						placeholder="Provide detailed instructions for taking this assessment..."
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
					/>
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
								<div>
									<label
										htmlFor="maxAttempts"
										className="block text-xs font-medium text-gray-600 mb-1">
										Maximum Attempts
									</label>
									<input
										type="number"
										id="maxAttempts"
										value={formData.maxAttempts || 1}
										onChange={(e) =>
											handleInputChange(
												"maxAttempts",
												parseInt(e.target.value) || 1
											)
										}
										min="1"
										max="10"
										className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Assignment Settings */}
				<div className="mt-4 pt-4 border-t border-gray-200">
					<h4 className="text-sm font-medium text-gray-900 mb-3">
						Assignment Settings
					</h4>
					<div className="space-y-2">
						<label className="flex items-center">
							<input
								type="checkbox"
								checked={formData.autoAssign}
								onChange={(e) =>
									handleInputChange("autoAssign", e.target.checked)
								}
								className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
							/>
							<span className="ml-2 text-sm text-gray-700">
								Auto-assign to eligible students immediately
							</span>
						</label>
						<label className="flex items-center">
							<input
								type="checkbox"
								checked={formData.assignOnLogin}
								onChange={(e) =>
									handleInputChange("assignOnLogin", e.target.checked)
								}
								className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
							/>
							<span className="ml-2 text-sm text-gray-700">
								Assign to new eligible students when they log in
							</span>
						</label>
					</div>
				</div>
			</div>

			{/* Validation Messages */}
			{(formData.title || "").trim() === "" && (
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

export default BasicDetailsForm;

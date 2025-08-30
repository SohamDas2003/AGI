"use client";

import { useState } from "react";
import {
	Plus,
	Search,
	Filter,
	Calendar,
	Clock,
	Users,
	CheckCircle,
	AlertCircle,
	Eye,
	Edit,
} from "lucide-react";
import { AssessmentTemplate, AssessmentStatus } from "@/types";

// Mock assessments data
const mockAssessments: AssessmentTemplate[] = [
	{
		id: "1",
		title: "Q1 2024 Skills Assessment",
		description:
			"Comprehensive assessment covering all 5 core skills for first quarter evaluation",
		skills: [
			"technical",
			"communication",
			"digital",
			"interpersonal",
			"creativity",
		],
		createdBy: "admin1",
		createdAt: new Date("2024-01-15"),
		updatedAt: new Date("2024-01-20"),
		status: "active",
		totalQuestions: 50,
		duration: 120,
		studentsAssigned: 156,
		studentsCompleted: 142,
	},
	{
		id: "2",
		title: "Technical Skills Deep Dive",
		description: "Focused assessment on domain and technical competencies",
		skills: ["technical"],
		createdBy: "admin2",
		createdAt: new Date("2024-02-01"),
		updatedAt: new Date("2024-02-05"),
		status: "draft",
		totalQuestions: 30,
		duration: 90,
		studentsAssigned: 0,
		studentsCompleted: 0,
	},
	{
		id: "3",
		title: "Communication & Interpersonal Skills",
		description:
			"Assessment focusing on soft skills and interpersonal abilities",
		skills: ["communication", "interpersonal"],
		createdBy: "admin1",
		createdAt: new Date("2024-01-25"),
		updatedAt: new Date("2024-01-28"),
		status: "completed",
		totalQuestions: 25,
		duration: 60,
		studentsAssigned: 98,
		studentsCompleted: 95,
	},
];

const getStatusColor = (status: AssessmentStatus) => {
	switch (status) {
		case "active":
			return "bg-green-100 text-green-800 border-green-200";
		case "draft":
			return "bg-gray-100 text-gray-800 border-gray-200";
		case "completed":
			return "bg-blue-100 text-blue-800 border-blue-200";
		case "archived":
			return "bg-red-100 text-red-800 border-red-200";
		default:
			return "bg-gray-100 text-gray-800 border-gray-200";
	}
};

const getStatusIcon = (status: AssessmentStatus) => {
	switch (status) {
		case "active":
			return <CheckCircle className="w-4 h-4" />;
		case "draft":
			return <Edit className="w-4 h-4" />;
		case "completed":
			return <CheckCircle className="w-4 h-4" />;
		case "archived":
			return <AlertCircle className="w-4 h-4" />;
		default:
			return <AlertCircle className="w-4 h-4" />;
	}
};

export default function AssessmentsPage() {
	const [assessments] = useState<AssessmentTemplate[]>(mockAssessments);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState<AssessmentStatus | "all">(
		"all"
	);

	const filteredAssessments = assessments.filter((assessment) => {
		const matchesSearch =
			assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			assessment.description.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus =
			statusFilter === "all" || assessment.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Assessments</h1>
					<p className="text-gray-600">
						Manage and create skill assessments for students
					</p>
				</div>
				<button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
					<Plus className="w-4 h-4" />
					Create Assessment
				</button>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="bg-white p-6 rounded-lg border border-gray-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								Total Assessments
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{assessments.length}
							</p>
						</div>
						<div className="p-3 bg-blue-100 rounded-lg">
							<Calendar className="w-6 h-6 text-blue-600" />
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-lg border border-gray-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">Active</p>
							<p className="text-2xl font-bold text-green-600">
								{assessments.filter((a) => a.status === "active").length}
							</p>
						</div>
						<div className="p-3 bg-green-100 rounded-lg">
							<CheckCircle className="w-6 h-6 text-green-600" />
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-lg border border-gray-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								Students Assigned
							</p>
							<p className="text-2xl font-bold text-purple-600">
								{assessments.reduce((sum, a) => sum + a.studentsAssigned, 0)}
							</p>
						</div>
						<div className="p-3 bg-purple-100 rounded-lg">
							<Users className="w-6 h-6 text-purple-600" />
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-lg border border-gray-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								Completion Rate
							</p>
							<p className="text-2xl font-bold text-orange-600">
								{Math.round(
									(assessments.reduce(
										(sum, a) => sum + a.studentsCompleted,
										0
									) /
										assessments.reduce(
											(sum, a) => sum + a.studentsAssigned,
											0
										)) *
										100
								) || 0}
								%
							</p>
						</div>
						<div className="p-3 bg-orange-100 rounded-lg">
							<Clock className="w-6 h-6 text-orange-600" />
						</div>
					</div>
				</div>
			</div>

			{/* Filters */}
			<div className="bg-white p-4 rounded-lg border border-gray-200">
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
						<input
							type="text"
							placeholder="Search assessments..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
					<div className="flex items-center gap-2">
						<Filter className="w-4 h-4 text-gray-400" />
						<select
							value={statusFilter}
							onChange={(e) =>
								setStatusFilter(e.target.value as AssessmentStatus | "all")
							}
							className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
							<option value="all">All Status</option>
							<option value="active">Active</option>
							<option value="draft">Draft</option>
							<option value="completed">Completed</option>
							<option value="archived">Archived</option>
						</select>
					</div>
				</div>
			</div>

			{/* Assessments List */}
			<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Assessment
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Skills
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Status
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Students
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Duration
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Created
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{filteredAssessments.map((assessment) => (
								<tr
									key={assessment.id}
									className="hover:bg-gray-50">
									<td className="px-6 py-4">
										<div>
											<div className="text-sm font-medium text-gray-900">
												{assessment.title}
											</div>
											<div className="text-sm text-gray-500">
												{assessment.description}
											</div>
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="flex flex-wrap gap-1">
											{assessment.skills.map((skill) => (
												<span
													key={skill}
													className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
													{skill}
												</span>
											))}
										</div>
									</td>
									<td className="px-6 py-4">
										<span
											className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
												assessment.status
											)}`}>
											{getStatusIcon(assessment.status)}
											{assessment.status}
										</span>
									</td>
									<td className="px-6 py-4">
										<div className="text-sm text-gray-900">
											{assessment.studentsCompleted}/
											{assessment.studentsAssigned}
										</div>
										<div className="text-xs text-gray-500">
											{assessment.studentsAssigned > 0
												? Math.round(
														(assessment.studentsCompleted /
															assessment.studentsAssigned) *
															100
												  )
												: 0}
											% completed
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center gap-1 text-sm text-gray-900">
											<Clock className="w-3 h-3" />
											{assessment.duration}m
										</div>
										<div className="text-xs text-gray-500">
											{assessment.totalQuestions} questions
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="text-sm text-gray-900">
											{assessment.createdAt.toLocaleDateString()}
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center gap-2">
											<button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
												<Eye className="w-4 h-4" />
											</button>
											<button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
												<Edit className="w-4 h-4" />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{filteredAssessments.length === 0 && (
					<div className="text-center py-12">
						<Calendar className="mx-auto h-12 w-12 text-gray-400" />
						<h3 className="mt-2 text-sm font-medium text-gray-900">
							No assessments found
						</h3>
						<p className="mt-1 text-sm text-gray-500">
							{searchTerm || statusFilter !== "all"
								? "Try adjusting your search or filter criteria."
								: "Get started by creating your first assessment."}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

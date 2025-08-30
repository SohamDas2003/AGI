"use client";

import { useState } from "react";
import {
	Search,
	Filter,
	Download,
	Eye,
	BarChart3,
	TrendingUp,
	TrendingDown,
	Users,
	Award,
} from "lucide-react";
import { Assessment, Student } from "@/types";

// Mock student assessment results
const mockResults = [
	{
		student: {
			_id: "1",
			studentId: "AGI001",
			rollNumber: "21MBA001",
			firstName: "Priya",
			lastName: "Sharma",
			email: "priya.sharma@agi.edu",
			course: "MBA" as const,
			division: "A",
			status: "active" as const,
			isFirstLogin: false,
			createdAt: new Date("2024-01-15"),
			updatedAt: new Date("2024-02-10"),
			fullName: "Priya Sharma",
		},
		assessment: {
			_id: "a1",
			studentId: "AGI001",
			skillScores: {
				domainSkills: 85,
				communicationSkills: 78,
				digitalSkills: 92,
				interpersonalSkills: 88,
				creativitySkills: 75,
			},
			overallScore: 83.6,
			placementRecommended: true,
			assessmentDate: new Date("2024-02-10"),
			completionStatus: "completed" as const,
			timeSpent: 110,
			answers: [],
		},
	},
	{
		student: {
			_id: "2",
			studentId: "AGI002",
			rollNumber: "21MCA002",
			firstName: "Rahul",
			lastName: "Patel",
			email: "rahul.patel@agi.edu",
			course: "MCA" as const,
			division: "B",
			status: "active" as const,
			isFirstLogin: false,
			createdAt: new Date("2024-01-16"),
			updatedAt: new Date("2024-02-08"),
			fullName: "Rahul Patel",
		},
		assessment: {
			_id: "a2",
			studentId: "AGI002",
			skillScores: {
				domainSkills: 92,
				communicationSkills: 70,
				digitalSkills: 95,
				interpersonalSkills: 82,
				creativitySkills: 88,
			},
			overallScore: 85.4,
			placementRecommended: true,
			assessmentDate: new Date("2024-02-08"),
			completionStatus: "completed" as const,
			timeSpent: 98,
			answers: [],
		},
	},
	{
		student: {
			_id: "3",
			studentId: "AGI003",
			rollNumber: "21PGDM003",
			firstName: "Sneha",
			lastName: "Gupta",
			email: "sneha.gupta@agi.edu",
			course: "PGDM" as const,
			division: "A",
			status: "active" as const,
			isFirstLogin: false,
			createdAt: new Date("2024-01-17"),
			updatedAt: new Date("2024-02-05"),
			fullName: "Sneha Gupta",
		},
		assessment: {
			_id: "a3",
			studentId: "AGI003",
			skillScores: {
				domainSkills: 76,
				communicationSkills: 85,
				digitalSkills: 80,
				interpersonalSkills: 90,
				creativitySkills: 82,
			},
			overallScore: 82.6,
			placementRecommended: true,
			assessmentDate: new Date("2024-02-05"),
			completionStatus: "completed" as const,
			timeSpent: 125,
			answers: [],
		},
	},
];

interface StudentResult {
	student: Student;
	assessment: Assessment;
}

const getScoreColor = (score: number) => {
	if (score >= 80) return "text-green-600 bg-green-100";
	if (score >= 70) return "text-yellow-600 bg-yellow-100";
	if (score >= 60) return "text-orange-600 bg-orange-100";
	return "text-red-600 bg-red-100";
};

const getScoreIcon = (score: number) => {
	if (score >= 80) return <TrendingUp className="w-4 h-4" />;
	if (score >= 70) return <BarChart3 className="w-4 h-4" />;
	return <TrendingDown className="w-4 h-4" />;
};

export default function ResultsPage() {
	const [results] = useState<StudentResult[]>(mockResults);
	const [searchTerm, setSearchTerm] = useState("");
	const [courseFilter, setCourseFilter] = useState<string>("all");
	const [statusFilter, setStatusFilter] = useState<string>("all");

	const filteredResults = results.filter((result) => {
		const matchesSearch =
			result.student.fullName
				?.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			result.student.rollNumber
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			result.student.email.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesCourse =
			courseFilter === "all" || result.student.course === courseFilter;
		const matchesStatus =
			statusFilter === "all" ||
			(statusFilter === "recommended" &&
				result.assessment.placementRecommended) ||
			(statusFilter === "not-recommended" &&
				!result.assessment.placementRecommended);
		return matchesSearch && matchesCourse && matchesStatus;
	});

	const completedCount = results.length;
	const recommendedCount = results.filter(
		(r) => r.assessment.placementRecommended
	).length;
	const averageScore = Math.round(
		results.reduce((sum, r) => sum + r.assessment.overallScore, 0) /
			results.length
	);

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">
						Assessment Results
					</h1>
					<p className="text-gray-600">
						View and analyze student assessment performance
					</p>
				</div>
				<div className="flex items-center gap-3">
					<button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
						<Download className="w-4 h-4" />
						Export Results
					</button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="bg-white p-6 rounded-lg border border-gray-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								Completed Assessments
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{completedCount}
							</p>
						</div>
						<div className="p-3 bg-blue-100 rounded-lg">
							<Users className="w-6 h-6 text-blue-600" />
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-lg border border-gray-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								Placement Recommended
							</p>
							<p className="text-2xl font-bold text-green-600">
								{recommendedCount}
							</p>
						</div>
						<div className="p-3 bg-green-100 rounded-lg">
							<Award className="w-6 h-6 text-green-600" />
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-lg border border-gray-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">Average Score</p>
							<p className="text-2xl font-bold text-purple-600">
								{averageScore}%
							</p>
						</div>
						<div className="p-3 bg-purple-100 rounded-lg">
							<BarChart3 className="w-6 h-6 text-purple-600" />
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-lg border border-gray-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								Recommendation Rate
							</p>
							<p className="text-2xl font-bold text-orange-600">
								{Math.round((recommendedCount / completedCount) * 100)}%
							</p>
						</div>
						<div className="p-3 bg-orange-100 rounded-lg">
							<TrendingUp className="w-6 h-6 text-orange-600" />
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
							placeholder="Search by name, roll number, or email..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
					<div className="flex items-center gap-2">
						<Filter className="w-4 h-4 text-gray-400" />
						<select
							value={courseFilter}
							onChange={(e) => setCourseFilter(e.target.value)}
							className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
							<option value="all">All Courses</option>
							<option value="MBA">MBA</option>
							<option value="MCA">MCA</option>
							<option value="PGDM">PGDM</option>
							<option value="BMS">BMS</option>
						</select>
						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
							<option value="all">All Status</option>
							<option value="recommended">Recommended</option>
							<option value="not-recommended">Not Recommended</option>
						</select>
					</div>
				</div>
			</div>

			{/* Results Table */}
			<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Student
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Overall Score
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Domain Skills
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Communication
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Digital Skills
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Interpersonal
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Creativity
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Placement
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{filteredResults.map((result) => (
								<tr
									key={result.student._id}
									className="hover:bg-gray-50">
									<td className="px-6 py-4">
										<div>
											<div className="text-sm font-medium text-gray-900">
												{result.student.fullName}
											</div>
											<div className="text-sm text-gray-500">
												{result.student.rollNumber} • {result.student.course}
											</div>
										</div>
									</td>
									<td className="px-6 py-4">
										<div
											className={`inline-flex items-center gap-1 px-2 py-1 text-sm font-medium rounded-full ${getScoreColor(
												result.assessment.overallScore
											)}`}>
											{getScoreIcon(result.assessment.overallScore)}
											{result.assessment.overallScore.toFixed(1)}%
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="text-sm text-gray-900">
											{result.assessment.skillScores.domainSkills}%
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="text-sm text-gray-900">
											{result.assessment.skillScores.communicationSkills}%
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="text-sm text-gray-900">
											{result.assessment.skillScores.digitalSkills}%
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="text-sm text-gray-900">
											{result.assessment.skillScores.interpersonalSkills}%
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="text-sm text-gray-900">
											{result.assessment.skillScores.creativitySkills}%
										</div>
									</td>
									<td className="px-6 py-4">
										<span
											className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
												result.assessment.placementRecommended
													? "bg-green-100 text-green-800"
													: "bg-red-100 text-red-800"
											}`}>
											{result.assessment.placementRecommended
												? "Recommended"
												: "Not Recommended"}
										</span>
									</td>
									<td className="px-6 py-4">
										<button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
											<Eye className="w-4 h-4" />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{filteredResults.length === 0 && (
					<div className="text-center py-12">
						<BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
						<h3 className="mt-2 text-sm font-medium text-gray-900">
							No results found
						</h3>
						<p className="mt-1 text-sm text-gray-500">
							{searchTerm || courseFilter !== "all" || statusFilter !== "all"
								? "Try adjusting your search or filter criteria."
								: "No assessment results available yet."}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

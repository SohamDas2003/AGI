"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import StudentSidebar from "@/components/dashboard/student-sidebar";
import Header from "@/components/dashboard/header";
import { 
	BarChart3, 
	TrendingUp, 
	Award, 
	Target,
	Filter,
	Search,
	Download,
	Eye
} from "lucide-react";

interface AssessmentResult {
	id: number;
	title: string;
	category: string;
	score: number;
	maxScore: number;
	completedDate: string;
	duration: number;
	skillBreakdown: {
		[key: string]: number;
	};
	percentile: number;
	status: "excellent" | "good" | "average" | "needs_improvement";
}

const mockResults: AssessmentResult[] = [
	{
		id: 1,
		title: "Communication Skills Assessment",
		category: "Communication Skills",
		score: 85,
		maxScore: 100,
		completedDate: "2025-09-01",
		duration: 28,
		skillBreakdown: {
			"Written Communication": 90,
			"Verbal Communication": 82,
			"Presentation Skills": 88,
			"Active Listening": 80
		},
		percentile: 78,
		status: "excellent"
	},
	{
		id: 2,
		title: "Technical Skills Evaluation",
		category: "Domain Skills",
		score: 78,
		maxScore: 100,
		completedDate: "2025-08-28",
		duration: 42,
		skillBreakdown: {
			"Programming": 85,
			"System Design": 75,
			"Database Management": 80,
			"Problem Solving": 72
		},
		percentile: 65,
		status: "good"
	},
	{
		id: 3,
		title: "Digital Literacy Test",
		category: "Digital Skills",
		score: 82,
		maxScore: 100,
		completedDate: "2025-08-25",
		duration: 25,
		skillBreakdown: {
			"Software Proficiency": 88,
			"Digital Tools": 85,
			"Data Analysis": 78,
			"Cloud Computing": 77
		},
		percentile: 70,
		status: "good"
	}
];

const getStatusColor = (status: string) => {
	switch (status) {
		case "excellent":
			return "bg-green-100 text-green-800";
		case "good":
			return "bg-blue-100 text-blue-800";
		case "average":
			return "bg-yellow-100 text-yellow-800";
		case "needs_improvement":
			return "bg-red-100 text-red-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
};

const getScoreColor = (score: number) => {
	if (score >= 80) return "text-green-600";
	if (score >= 60) return "text-yellow-600";
	return "text-red-600";
};

export default function StudentResults() {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState("");
	const [filterCategory, setFilterCategory] = useState("all");

	const filteredResults = mockResults.filter(result => {
		const matchesSearch = result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
							 result.category.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesFilter = filterCategory === "all" || result.category === filterCategory;
		return matchesSearch && matchesFilter;
	});

	const overallStats = {
		averageScore: Math.round(mockResults.reduce((sum, result) => sum + result.score, 0) / mockResults.length),
		totalAssessments: mockResults.length,
		bestScore: Math.max(...mockResults.map(r => r.score)),
		averagePercentile: Math.round(mockResults.reduce((sum, result) => sum + result.percentile, 0) / mockResults.length)
	};

	const handleViewDetails = (resultId: number) => {
		// Navigate to detailed result view
		console.log("Viewing details for result:", resultId);
		alert("Detailed result view would open here");
	};

	const handleDownloadReport = () => {
		alert("Report download would start here");
	};
	return (
		<div className="flex h-screen bg-gray-50">
			<StudentSidebar />
			
			<div className="flex-1 flex flex-col overflow-hidden">
				<Header />
				
				<main className="flex-1 overflow-y-auto p-6">
					<div className="max-w-7xl mx-auto space-y-6">
						{/* Header */}
						<div className="flex justify-between items-center">
							<div>
								<h1 className="text-3xl font-bold text-gray-900">Assessment Results</h1>
								<p className="text-gray-600 mt-1">Track your progress and performance across all assessments</p>
							</div>
							<button
								onClick={handleDownloadReport}
								className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
							>
								<Download className="w-4 h-4 mr-2" />
								Download Report
							</button>
						</div>

						{/* Overall Stats */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							<div className="bg-white rounded-lg shadow p-6">
								<div className="flex items-center">
									<div className="flex-shrink-0">
										<BarChart3 className="w-8 h-8 text-blue-600" />
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-600">Average Score</p>
										<p className="text-2xl font-bold text-gray-900">{overallStats.averageScore}%</p>
									</div>
								</div>
							</div>

							<div className="bg-white rounded-lg shadow p-6">
								<div className="flex items-center">
									<div className="flex-shrink-0">
										<Target className="w-8 h-8 text-green-600" />
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-600">Assessments Completed</p>
										<p className="text-2xl font-bold text-gray-900">{overallStats.totalAssessments}</p>
									</div>
								</div>
							</div>

							<div className="bg-white rounded-lg shadow p-6">
								<div className="flex items-center">
									<div className="flex-shrink-0">
										<Award className="w-8 h-8 text-purple-600" />
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-600">Best Score</p>
										<p className="text-2xl font-bold text-gray-900">{overallStats.bestScore}%</p>
									</div>
								</div>
							</div>

							<div className="bg-white rounded-lg shadow p-6">
								<div className="flex items-center">
									<div className="flex-shrink-0">
										<TrendingUp className="w-8 h-8 text-orange-600" />
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-600">Avg. Percentile</p>
										<p className="text-2xl font-bold text-gray-900">{overallStats.averagePercentile}th</p>
									</div>
								</div>
							</div>
						</div>

						{/* Filters */}
						<div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg border border-gray-200">
							<div className="flex-1">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
									<input
										type="text"
										placeholder="Search results..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Filter className="w-4 h-4 text-gray-400" />
								<select 
									value={filterCategory}
									onChange={(e) => setFilterCategory(e.target.value)}
									className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								>
									<option value="all">All Categories</option>
									<option value="Communication Skills">Communication Skills</option>
									<option value="Domain Skills">Domain Skills</option>
									<option value="Digital Skills">Digital Skills</option>
									<option value="Interpersonal Skills">Interpersonal Skills</option>
									<option value="Problem Solving">Problem Solving</option>
								</select>
							</div>
						</div>

						{/* Results List */}
						<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
							<div className="divide-y divide-gray-200">
								{filteredResults.map((result) => (
									<div key={result.id} className="p-6 hover:bg-gray-50">
										<div className="flex items-center justify-between mb-4">
											<div className="flex-1">
												<h3 className="text-lg font-medium text-gray-900">
													{result.title}
												</h3>
												<div className="flex items-center space-x-4 mt-1">
													<span className="text-sm text-gray-600">{result.category}</span>
													<span className="text-sm text-gray-500">•</span>
													<span className="text-sm text-gray-600">
														Completed on {new Date(result.completedDate).toLocaleDateString()}
													</span>
													<span className="text-sm text-gray-500">•</span>
													<span className="text-sm text-gray-600">
														{result.duration} minutes
													</span>
												</div>
											</div>
											<div className="flex items-center space-x-4">
												<div className="text-right">
													<div className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
														{result.score}%
													</div>
													<div className="text-xs text-gray-500">
														{result.percentile}th percentile
													</div>
												</div>
												<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(result.status)}`}>
													{result.status.replace('_', ' ').toUpperCase()}
												</span>
												<button
													onClick={() => handleViewDetails(result.id)}
													className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
												>
													<Eye className="w-4 h-4" />
												</button>
											</div>
										</div>

										{/* Skill Breakdown */}
										<div className="space-y-2">
											<h4 className="text-sm font-medium text-gray-700">Skill Breakdown:</h4>
											<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
												{Object.entries(result.skillBreakdown).map(([skill, score]) => (
													<div key={skill} className="text-center">
														<div className="text-sm font-medium text-gray-900">{score}%</div>
														<div className="text-xs text-gray-600">{skill}</div>
														<div className="w-full bg-gray-200 rounded-full h-1 mt-1">
															<div 
																className={`h-1 rounded-full ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
																style={{ width: `${score}%` }}
															></div>
														</div>
													</div>
												))}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

						{filteredResults.length === 0 && (
							<div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
								<div className="text-gray-500">
									<BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
									<h3 className="text-lg font-medium mb-2">No results found</h3>
									<p className="mb-4">Complete assessments to see your results here.</p>
									<button
										onClick={() => router.push('/student-dashboard/assessments')}
										className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
									>
										<Target className="w-4 h-4 mr-2" />
										Take Assessments
									</button>
								</div>
							</div>
						)}
					</div>
				</main>
			</div>
		</div>
	);
}

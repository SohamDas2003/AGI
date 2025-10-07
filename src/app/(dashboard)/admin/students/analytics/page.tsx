"use client";

import React, { useState, useEffect } from "react";
import {
	Users,
	Search,
	Filter,
	Download,
	TrendingUp,
	AlertTriangle,
	Award,
	X,
} from "lucide-react";
import Link from "next/link";

interface Student {
	_id: string;
	name: string;
	email: string;
	course: string;
	batchName: string;
	status: string;
	overallPercentage: number | null;
	overallAverageRating: number | null;
	completedAssessments: number;
	sectionsNeedingAttention: string[];
	needsAttention: boolean;
}

export default function StudentsAnalyticsPage() {
	const [students, setStudents] = useState<Student[]>([]);
	const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Filters
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCourse, setSelectedCourse] = useState<string>("ALL");
	const [selectedBatch, setSelectedBatch] = useState<string>("ALL");
	const [scoreFilter, setScoreFilter] = useState<string>("ALL");
	const [attentionFilter, setAttentionFilter] = useState<string>("ALL");

	// Available filter options
	const [courses, setCourses] = useState<string[]>([]);
	const [batches, setBatches] = useState<string[]>([]);

	const fetchStudentsAnalytics = async () => {
		try {
			const res = await fetch("/api/students/analytics");
			const result = await res.json();

			if (result.success) {
				setStudents(result.students);

				// Extract unique courses and batches
				const uniqueCourses = [
					...new Set(result.students.map((s: Student) => s.course)),
				];
				const uniqueBatches = [
					...new Set(result.students.map((s: Student) => s.batchName)),
				];
				setCourses(uniqueCourses as string[]);
				setBatches(uniqueBatches as string[]);
			} else {
				setError(result.error || "Failed to load analytics");
			}
		} catch (err) {
			console.error("Error fetching analytics:", err);
			setError("Failed to load student analytics");
		} finally {
			setLoading(false);
		}
	};

	const applyFilters = () => {
		let filtered = [...students];

		// Search filter
		if (searchTerm) {
			filtered = filtered.filter(
				(s) =>
					s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					s.email.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// Course filter
		if (selectedCourse !== "ALL") {
			filtered = filtered.filter((s) => s.course === selectedCourse);
		}

		// Batch filter
		if (selectedBatch !== "ALL") {
			filtered = filtered.filter((s) => s.batchName === selectedBatch);
		}

		// Score filter
		if (scoreFilter !== "ALL") {
			filtered = filtered.filter((s) => {
				const percentage = s.overallPercentage || 0;
				switch (scoreFilter) {
					case "EXCELLENT":
						return percentage >= 80;
					case "GOOD":
						return percentage >= 60 && percentage < 80;
					case "NEEDS_IMPROVEMENT":
						return percentage >= 40 && percentage < 60;
					case "CRITICAL":
						return percentage < 40;
					default:
						return true;
				}
			});
		}

		// Attention filter
		if (attentionFilter !== "ALL") {
			if (attentionFilter === "NEEDS_ATTENTION") {
				filtered = filtered.filter((s) => s.needsAttention);
			} else if (attentionFilter === "PERFORMING_WELL") {
				filtered = filtered.filter((s) => !s.needsAttention);
			}
		}

		setFilteredStudents(filtered);
	};

	useEffect(() => {
		fetchStudentsAnalytics();
	}, []);

	useEffect(() => {
		applyFilters();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		students,
		searchTerm,
		selectedCourse,
		selectedBatch,
		scoreFilter,
		attentionFilter,
	]);

	const clearFilters = () => {
		setSearchTerm("");
		setSelectedCourse("ALL");
		setSelectedBatch("ALL");
		setScoreFilter("ALL");
		setAttentionFilter("ALL");
	};

	const getPerformanceColor = (percentage: number | null) => {
		if (percentage === null) return "text-gray-500";
		if (percentage >= 80) return "text-green-600";
		if (percentage >= 60) return "text-yellow-600";
		if (percentage >= 40) return "text-orange-600";
		return "text-red-600";
	};

	const getPerformanceBadge = (percentage: number | null) => {
		if (percentage === null)
			return { bg: "bg-gray-100", text: "text-gray-700", label: "No Data" };
		if (percentage >= 80)
			return { bg: "bg-green-100", text: "text-green-700", label: "Excellent" };
		if (percentage >= 60)
			return { bg: "bg-yellow-100", text: "text-yellow-700", label: "Good" };
		if (percentage >= 40)
			return { bg: "bg-orange-100", text: "text-orange-700", label: "Fair" };
		return { bg: "bg-red-100", text: "text-red-700", label: "Needs Help" };
	};

	const exportToCSV = () => {
		const headers = [
			"Name",
			"Email",
			"Course",
			"Batch",
			"Overall %",
			"Avg Rating",
			"Completed",
			"Needs Attention",
		];
		const rows = filteredStudents.map((s) => [
			s.name,
			s.email,
			s.course,
			s.batchName,
			s.overallPercentage?.toFixed(1) || "N/A",
			s.overallAverageRating?.toFixed(1) || "N/A",
			s.completedAssessments,
			s.needsAttention ? "Yes" : "No",
		]);

		const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
		const blob = new Blob([csv], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `student-analytics-${new Date().toISOString()}.csv`;
		a.click();
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading analytics...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						Unable to Load Analytics
					</h2>
					<p className="text-gray-600 mb-4">{error}</p>
				</div>
			</div>
		);
	}

	const activeFiltersCount = [
		searchTerm !== "",
		selectedCourse !== "ALL",
		selectedBatch !== "ALL",
		scoreFilter !== "ALL",
		attentionFilter !== "ALL",
	].filter(Boolean).length;

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="bg-white rounded-lg shadow-sm p-6 mb-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-gray-900 flex items-center">
								<Users className="w-7 h-7 mr-3 text-blue-600" />
								Student Analytics Overview
							</h1>
							<p className="text-gray-600 mt-1">
								Showing {filteredStudents.length} of {students.length} students
							</p>
						</div>
						<button
							onClick={exportToCSV}
							className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
							<Download className="w-4 h-4 mr-2" />
							Export CSV
						</button>
					</div>
				</div>

				{/* Summary Stats */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
					<div className="bg-white rounded-lg shadow-sm p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Total Students</p>
								<p className="text-2xl font-bold text-gray-900">
									{students.length}
								</p>
							</div>
							<Users className="w-10 h-10 text-blue-600" />
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-sm p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Need Attention</p>
								<p className="text-2xl font-bold text-red-600">
									{students.filter((s) => s.needsAttention).length}
								</p>
							</div>
							<AlertTriangle className="w-10 h-10 text-red-600" />
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-sm p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Top Performers</p>
								<p className="text-2xl font-bold text-green-600">
									{
										students.filter((s) => (s.overallPercentage || 0) >= 80)
											.length
									}
								</p>
							</div>
							<Award className="w-10 h-10 text-green-600" />
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-sm p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600">Avg Performance</p>
								<p className="text-2xl font-bold text-purple-600">
									{(
										students.reduce(
											(sum, s) => sum + (s.overallPercentage || 0),
											0
										) / students.length
									).toFixed(1)}
									%
								</p>
							</div>
							<TrendingUp className="w-10 h-10 text-purple-600" />
						</div>
					</div>
				</div>

				{/* Filters */}
				<div className="bg-white rounded-lg shadow-sm p-6 mb-6">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-semibold text-gray-900 flex items-center">
							<Filter className="w-5 h-5 mr-2" />
							Filters
							{activeFiltersCount > 0 && (
								<span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
									{activeFiltersCount}
								</span>
							)}
						</h2>
						{activeFiltersCount > 0 && (
							<button
								onClick={clearFilters}
								className="flex items-center text-sm text-blue-600 hover:text-blue-700">
								<X className="w-4 h-4 mr-1" />
								Clear All
							</button>
						)}
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
						{/* Search */}
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
							<input
								type="text"
								placeholder="Search by name or email..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>

						{/* Course Filter */}
						<select
							value={selectedCourse}
							onChange={(e) => setSelectedCourse(e.target.value)}
							className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
							<option value="ALL">All Courses</option>
							{courses.map((course) => (
								<option
									key={course}
									value={course}>
									{course}
								</option>
							))}
						</select>

						{/* Batch Filter */}
						<select
							value={selectedBatch}
							onChange={(e) => setSelectedBatch(e.target.value)}
							className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
							<option value="ALL">All Batches</option>
							{batches.map((batch) => (
								<option
									key={batch}
									value={batch}>
									{batch}
								</option>
							))}
						</select>

						{/* Score Filter */}
						<select
							value={scoreFilter}
							onChange={(e) => setScoreFilter(e.target.value)}
							className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
							<option value="ALL">All Scores</option>
							<option value="EXCELLENT">Excellent (80%+)</option>
							<option value="GOOD">Good (60-79%)</option>
							<option value="NEEDS_IMPROVEMENT">Fair (40-59%)</option>
							<option value="CRITICAL">Critical (&lt;40%)</option>
						</select>

						{/* Attention Filter */}
						<select
							value={attentionFilter}
							onChange={(e) => setAttentionFilter(e.target.value)}
							className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
							<option value="ALL">All Students</option>
							<option value="NEEDS_ATTENTION">Needs Attention</option>
							<option value="PERFORMING_WELL">Performing Well</option>
						</select>
					</div>
				</div>

				{/* Students Table */}
				<div className="bg-white rounded-lg shadow-sm overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50 border-b border-gray-200">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Student
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Course / Batch
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Overall Score
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Avg Rating
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Completed
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Status
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredStudents.map((student) => {
									const badge = getPerformanceBadge(student.overallPercentage);
									return (
										<tr
											key={student._id}
											className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap">
												<div>
													<div className="text-sm font-medium text-gray-900">
														{student.name}
													</div>
													<div className="text-sm text-gray-500">
														{student.email}
													</div>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm text-gray-900">
													{student.course}
												</div>
												<div className="text-sm text-gray-500">
													{student.batchName}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div
													className={`text-2xl font-bold ${getPerformanceColor(
														student.overallPercentage
													)}`}>
													{student.overallPercentage?.toFixed(1) || "N/A"}%
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm text-gray-900">
													{student.overallAverageRating?.toFixed(1) || "N/A"} /
													5
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm text-gray-900">
													{student.completedAssessments} assessments
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span
													className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${badge.bg} ${badge.text}`}>
													{badge.label}
												</span>
												{student.needsAttention && (
													<div className="mt-1">
														<span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-700">
															<AlertTriangle className="w-3 h-3 mr-1" />
															Attention
														</span>
													</div>
												)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
												<Link
													href={`/admin/students/${student._id}/analytics`}
													className="text-blue-600 hover:text-blue-900">
													View Details
												</Link>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>

					{filteredStudents.length === 0 && (
						<div className="text-center py-12">
							<Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
							<p className="text-gray-600">
								No students found matching your filters
							</p>
							<button
								onClick={clearFilters}
								className="mt-4 text-blue-600 hover:text-blue-700">
								Clear filters
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

"use client";

import React, { useEffect, useState } from "react";
import {
	FileText,
	Users,
	Clock,
	BarChart3,
	Eye,
	Edit,
	Trash2,
	Plus,
	CheckCircle,
	UserCheck,
	Filter,
	Search,
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";

interface Assessment {
	_id: string;
	title: string;
	description: string;
	status: string;
	createdAt: string;
	updatedAt: string;
	criteria: {
		course: string[];
	};
	timeLimit: number;
	totalSections: number;
	totalQuestions: number;
	stats: {
		totalEligibleStudents: number;
		totalAssigned: number;
		totalStarted: number;
		totalCompleted: number;
		completionRate: number;
		averageScore: number;
		averageTimeSpent: number;
	};
}

function AssessmentsPage() {
	const [assessments, setAssessments] = useState<Assessment[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchAssessments();
	}, []);

	const fetchAssessments = async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/assessments", {
				credentials: "include",
			});

			if (response.ok) {
				const data = await response.json();
				setAssessments(data.assessments || []);
			} else {
				setError("Failed to fetch assessments");
			}
		} catch (error) {
			console.error("Error fetching assessments:", error);
			setError("Error loading assessments");
		} finally {
			setLoading(false);
		}
	};

	const filteredAssessments = assessments.filter((assessment) => {
		const matchesSearch =
			assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			assessment.description.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus =
			statusFilter === "all" || assessment.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const getStatusBadge = (status: string) => {
		const statusConfig = {
			active: { color: "bg-green-100 text-green-800", label: "Active" },
			draft: { color: "bg-yellow-100 text-yellow-800", label: "Draft" },
			archived: { color: "bg-gray-100 text-gray-800", label: "Archived" },
		};

		const config =
			statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
		return (
			<span
				className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
				{config.label}
			</span>
		);
	};

	if (loading) {
		return (
			<ProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN"]}>
				<div className="p-6">
					<div className="animate-pulse space-y-4">
						<div className="h-8 bg-gray-200 rounded w-1/4"></div>
						<div className="space-y-3">
							{[...Array(5)].map((_, i) => (
								<div
									key={i}
									className="h-20 bg-gray-200 rounded"></div>
							))}
						</div>
					</div>
				</div>
			</ProtectedRoute>
		);
	}

	return (
		<ProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN"]}>
			<div className="p-6 space-y-6">
				{/* Header */}
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
							<FileText className="h-6 w-6" />
							Assessment Management
						</h1>
						<p className="text-gray-600 mt-1">
							View and manage all created assessments
						</p>
					</div>
					<Link
						href="/admin/create-assessment"
						className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
						<Plus className="h-4 w-4" />
						Create Assessment
					</Link>
				</div>

				{/* Summary Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div className="bg-white p-4 rounded-lg border shadow-sm">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-blue-100 rounded-lg">
								<FileText className="h-5 w-5 text-blue-600" />
							</div>
							<div>
								<p className="text-sm text-gray-600">Total Assessments</p>
								<p className="text-xl font-semibold">{assessments.length}</p>
							</div>
						</div>
					</div>
					<div className="bg-white p-4 rounded-lg border shadow-sm">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-green-100 rounded-lg">
								<CheckCircle className="h-5 w-5 text-green-600" />
							</div>
							<div>
								<p className="text-sm text-gray-600">Active</p>
								<p className="text-xl font-semibold">
									{assessments.filter((a) => a.status === "active").length}
								</p>
							</div>
						</div>
					</div>
					<div className="bg-white p-4 rounded-lg border shadow-sm">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-yellow-100 rounded-lg">
								<Clock className="h-5 w-5 text-yellow-600" />
							</div>
							<div>
								<p className="text-sm text-gray-600">Draft</p>
								<p className="text-xl font-semibold">
									{assessments.filter((a) => a.status === "draft").length}
								</p>
							</div>
						</div>
					</div>
					<div className="bg-white p-4 rounded-lg border shadow-sm">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-purple-100 rounded-lg">
								<Users className="h-5 w-5 text-purple-600" />
							</div>
							<div>
								<p className="text-sm text-gray-600">Total Assigned</p>
								<p className="text-xl font-semibold">
									{assessments.reduce(
										(sum, a) => sum + a.stats.totalAssigned,
										0
									)}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Filters */}
				<div className="bg-white p-4 rounded-lg border shadow-sm">
					<div className="flex flex-col md:flex-row gap-4">
						<div className="flex-1">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
								<input
									type="text"
									placeholder="Search assessments..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Filter className="h-4 w-4 text-gray-500" />
							<select
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
								className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
								<option value="all">All Status</option>
								<option value="active">Active</option>
								<option value="draft">Draft</option>
								<option value="archived">Archived</option>
							</select>
						</div>
					</div>
				</div>

				{/* Error Message */}
				{error && (
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
						{error}
					</div>
				)}

				{/* Assessments List */}
				<div className="bg-white rounded-lg border shadow-sm overflow-hidden">
					{filteredAssessments.length === 0 ? (
						<div className="text-center py-12">
							<FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								No assessments found
							</h3>
							<p className="text-gray-600 mb-4">
								{searchTerm || statusFilter !== "all"
									? "Try adjusting your search or filters"
									: "Get started by creating your first assessment"}
							</p>
							{!searchTerm && statusFilter === "all" && (
								<Link
									href="/admin/create-assessment"
									className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors">
									<Plus className="h-4 w-4" />
									Create Assessment
								</Link>
							)}
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Assessment
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Status
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Target Courses
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Questions
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Assignments
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Progress
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
											key={assessment._id}
											className="hover:bg-gray-50">
											<td className="px-6 py-4">
												<div>
													<div className="font-medium text-gray-900">
														{assessment.title}
													</div>
													<div className="text-sm text-gray-500 mt-1">
														{assessment.description}
													</div>
													<div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
														<span className="flex items-center gap-1">
															<Clock className="h-3 w-3" />
															{assessment.timeLimit} min
														</span>
														<span className="flex items-center gap-1">
															<FileText className="h-3 w-3" />
															{assessment.totalSections} sections
														</span>
													</div>
												</div>
											</td>
											<td className="px-6 py-4">
												{getStatusBadge(assessment.status)}
											</td>
											<td className="px-6 py-4">
												<div className="text-sm">
													{assessment.criteria.course.map((course, index) => (
														<span
															key={index}
															className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
															{course}
														</span>
													))}
												</div>
											</td>
											<td className="px-6 py-4 text-sm text-gray-900">
												{assessment.totalQuestions}
											</td>
											<td className="px-6 py-4">
												<div className="text-sm">
													<div className="flex items-center gap-1 text-gray-900">
														<UserCheck className="h-3 w-3" />
														{assessment.stats.totalAssigned}
													</div>
													<div className="text-xs text-gray-500">
														of {assessment.stats.totalEligibleStudents} eligible
													</div>
												</div>
											</td>
											<td className="px-6 py-4">
												<div className="text-sm space-y-1">
													<div className="flex items-center justify-between">
														<span className="text-xs text-gray-500">
															Completed:
														</span>
														<span className="text-sm font-medium">
															{assessment.stats.totalCompleted}
														</span>
													</div>
													<div className="flex items-center justify-between">
														<span className="text-xs text-gray-500">
															Started:
														</span>
														<span className="text-sm font-medium">
															{assessment.stats.totalStarted}
														</span>
													</div>
													<div className="w-full bg-gray-200 rounded-full h-1.5">
														<div
															className="bg-green-600 h-1.5 rounded-full"
															style={{
																width: `${assessment.stats.completionRate}%`,
															}}></div>
													</div>
													<div className="text-xs text-gray-500 text-center">
														{assessment.stats.completionRate.toFixed(1)}%
														complete
													</div>
												</div>
											</td>
											<td className="px-6 py-4 text-sm text-gray-500">
												{formatDate(assessment.createdAt)}
											</td>
											<td className="px-6 py-4">
												<div className="flex items-center gap-2">
													<Link
														href={`/admin/assessments/${assessment._id}/details`}
														className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
														title="View Details">
														<Eye className="h-4 w-4" />
													</Link>
													<Link
														href={`/admin/assessments/${assessment._id}/edit`}
														className="p-1 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded"
														title="Edit Assessment">
														<Edit className="h-4 w-4" />
													</Link>
													<Link
														href={`/admin/assessments/${assessment._id}/analytics`}
														className="p-1 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded"
														title="View Analytics">
														<BarChart3 className="h-4 w-4" />
													</Link>
													<button
														onClick={async () => {
															if (
																confirm(
																	`Are you sure you want to delete "${assessment.title}"? This action cannot be undone.`
																)
															) {
																try {
																	const response = await fetch(
																		`/api/assessments/${assessment._id}`,
																		{
																			method: "DELETE",
																			credentials: "include",
																		}
																	);

																	if (response.ok) {
																		alert("Assessment deleted successfully");
																		fetchAssessments();
																	} else {
																		const result = await response.json();
																		alert(
																			result.error ||
																				"Failed to delete assessment"
																		);
																	}
																} catch (error) {
																	console.error(
																		"Error deleting assessment:",
																		error
																	);
																	alert("Failed to delete assessment");
																}
															}
														}}
														className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
														title="Delete Assessment">
														<Trash2 className="h-4 w-4" />
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>
		</ProtectedRoute>
	);
}

export default AssessmentsPage;

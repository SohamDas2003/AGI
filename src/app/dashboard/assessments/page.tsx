"use client";

import React, { useState } from "react";
import { Plus, Search, Filter, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

interface Assessment {
	id: string;
	title: string;
	course: string;
	batch: string;
	totalQuestions: number;
	status: "active" | "draft" | "completed" | "archived";
	studentsAssigned: number;
	studentsCompleted: number;
	createdAt: string;
	createdBy: string;
}

const mockAssessments: Assessment[] = [
	{
		id: "1",
		title: "MCA Placement Assessment - Technical Skills",
		course: "MCA",
		batch: "2024-26",
		totalQuestions: 50,
		status: "active",
		studentsAssigned: 120,
		studentsCompleted: 85,
		createdAt: "2024-01-15",
		createdBy: "Admin User",
	},
	{
		id: "2",
		title: "PGDM Leadership Assessment",
		course: "PGDM",
		batch: "2025-27",
		totalQuestions: 50,
		status: "draft",
		studentsAssigned: 0,
		studentsCompleted: 0,
		createdAt: "2024-01-10",
		createdBy: "Admin User",
	},
	{
		id: "3",
		title: "MMS Communication Skills Test",
		course: "MMS",
		batch: "2024-26",
		totalQuestions: 50,
		status: "completed",
		studentsAssigned: 80,
		studentsCompleted: 80,
		createdAt: "2023-12-20",
		createdBy: "Admin User",
	},
];

const getStatusColor = (status: string) => {
	switch (status) {
		case "active":
			return "bg-green-100 text-green-800";
		case "draft":
			return "bg-yellow-100 text-yellow-800";
		case "completed":
			return "bg-blue-100 text-blue-800";
		case "archived":
			return "bg-gray-100 text-gray-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
};

export default function AssessmentsPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState("all");

	const filteredAssessments = mockAssessments.filter((assessment) => {
		const matchesSearch =
			assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			assessment.course.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesFilter =
			filterStatus === "all" || assessment.status === filterStatus;
		return matchesSearch && matchesFilter;
	});

	return (
		<div className="max-w-7xl mx-auto space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Assessments</h1>
					<p className="text-gray-600 mt-1">
						Create and manage placement assessments
					</p>
				</div>
				<Link
					href="/dashboard/assessments/create"
					className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
					<Plus className="w-4 h-4 mr-2" />
					Create Assessment
				</Link>
			</div>

			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg border border-gray-200">
				<div className="flex-1">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
						<input
							type="text"
							placeholder="Search assessments..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Filter className="w-4 h-4 text-gray-400" />
					<select
						value={filterStatus}
						onChange={(e) => setFilterStatus(e.target.value)}
						className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
						<option value="all">All Status</option>
						<option value="active">Active</option>
						<option value="draft">Draft</option>
						<option value="completed">Completed</option>
						<option value="archived">Archived</option>
					</select>
				</div>
			</div>

			{/* Assessments Table */}
			<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50 border-b border-gray-200">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Assessment
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Course & Batch
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Status
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Progress
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Created
								</th>
								<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{filteredAssessments.map((assessment) => (
								<tr
									key={assessment.id}
									className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div>
											<div className="text-sm font-medium text-gray-900">
												{assessment.title}
											</div>
											<div className="text-sm text-gray-500">
												{assessment.totalQuestions} questions
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">
											{assessment.course}
										</div>
										<div className="text-sm text-gray-500">
											{assessment.batch}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
												assessment.status
											)}`}>
											{assessment.status.charAt(0).toUpperCase() +
												assessment.status.slice(1)}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">
											{assessment.studentsCompleted}/
											{assessment.studentsAssigned} completed
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2 mt-1">
											<div
												className="bg-blue-600 h-2 rounded-full"
												style={{
													width:
														assessment.studentsAssigned > 0
															? `${
																	(assessment.studentsCompleted /
																		assessment.studentsAssigned) *
																	100
															  }%`
															: "0%",
												}}></div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{new Date(assessment.createdAt).toLocaleDateString()}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<div className="flex items-center justify-end space-x-2">
											<button className="text-blue-600 hover:text-blue-900">
												<Eye className="w-4 h-4" />
											</button>
											<button className="text-gray-600 hover:text-gray-900">
												<Edit className="w-4 h-4" />
											</button>
											<button className="text-red-600 hover:text-red-900">
												<Trash2 className="w-4 h-4" />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{filteredAssessments.length === 0 && (
				<div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
					<div className="text-gray-500">
						<Plus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
						<h3 className="text-lg font-medium mb-2">No assessments found</h3>
						<p className="mb-4">
							Get started by creating your first assessment.
						</p>
						<Link
							href="/dashboard/assessments/create"
							className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
							<Plus className="w-4 h-4 mr-2" />
							Create Assessment
						</Link>
					</div>
				</div>
			)}
		</div>
	);
}

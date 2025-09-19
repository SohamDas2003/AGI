"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
	ChevronDown,
	Search,
	Filter,
	Download,
	Eye,
	Edit,
	Trash2,
	Award,
	Calendar,
	User,
} from "lucide-react";
import { Student } from "@/types";

interface StudentTableProps {
	students: Student[];
	className?: string;
}

const statusStyles = {
	active: "bg-green-100 text-green-800 border-green-200",
	inactive: "bg-yellow-100 text-yellow-800 border-yellow-200",
	suspended: "bg-red-100 text-red-800 border-red-200",
};

const courseColors = {
	MMS: "bg-blue-100 text-blue-800",
	MCA: "bg-purple-100 text-purple-800",
	PGDM: "bg-green-100 text-green-800",
};

export default function StudentTable({
	students,
	className,
}: StudentTableProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [sortField, setSortField] = useState<keyof Student>("firstName");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
	const [filterStatus, setFilterStatus] = useState<string>("all");
	const [filterCourse, setFilterCourse] = useState<string>("all");

	const filteredStudents = students.filter((student) => {
		const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
		const matchesSearch =
			fullName.includes(searchTerm.toLowerCase()) ||
			student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			student.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
			student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
			student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus =
			filterStatus === "all" || student.status === filterStatus;
		const matchesCourse =
			filterCourse === "all" || student.course === filterCourse;
		return matchesSearch && matchesStatus && matchesCourse;
	});

	const sortedStudents = [...filteredStudents].sort((a, b) => {
		const aValue = a[sortField];
		const bValue = b[sortField];

		if (typeof aValue === "string" && typeof bValue === "string") {
			return sortDirection === "asc"
				? aValue.localeCompare(bValue)
				: bValue.localeCompare(aValue);
		}

		if (typeof aValue === "number" && typeof bValue === "number") {
			return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
		}

		return 0;
	});

	const handleSort = (field: keyof Student) => {
		if (sortField === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	};

	const formatDate = (date?: Date) => {
		if (!date) return "Never";
		return new Date(date).toLocaleDateString();
	};

	const formatTimeAgo = (date?: Date) => {
		if (!date) return "Never logged in";
		const now = new Date();
		const diffMs = now.getTime() - new Date(date).getTime();
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		const diffDays = Math.floor(diffHours / 24);

		if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
		if (diffHours > 0)
			return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
		return "Recently";
	};

	const uniqueCourses = [...new Set(students.map((s) => s.course))];

	return (
		<div
			className={cn(
				"bg-white rounded-xl border border-gray-200 overflow-hidden",
				className
			)}>
			{/* Header */}
			<div className="p-6 border-b border-gray-200">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-lg font-semibold text-gray-900">
							Student Management
						</h3>
						<p className="text-sm text-gray-600">
							Manage student profiles and track assessment progress
						</p>
					</div>
					<div className="flex items-center space-x-3">
						<button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
							<Download className="w-4 h-4 mr-2" />
							Export
						</button>
						<button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
							<Filter className="w-4 h-4 mr-2" />
							Filter
						</button>
					</div>
				</div>

				{/* Search and Filters */}
				<div className="mt-4 flex items-center space-x-4">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
						<input
							type="text"
							placeholder="Search students by name, email, ID, or roll number..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
						/>
					</div>
					<select
						value={filterCourse}
						onChange={(e) => setFilterCourse(e.target.value)}
						className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
						<option value="all">All Courses</option>
						{uniqueCourses.map((course) => (
							<option
								key={course}
								value={course}>
								{course}
							</option>
						))}
					</select>
					<select
						value={filterStatus}
						onChange={(e) => setFilterStatus(e.target.value)}
						className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
						<option value="all">All Status</option>
						<option value="active">Active</option>
						<option value="inactive">Inactive</option>
						<option value="suspended">Suspended</option>
					</select>
				</div>
			</div>

			{/* Table */}
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-gray-50">
						<tr>
							<th
								className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
								onClick={() => handleSort("firstName")}>
								<div className="flex items-center space-x-1">
									<span>Student</span>
									<ChevronDown className="w-4 h-4" />
								</div>
							</th>
							<th
								className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
								onClick={() => handleSort("course")}>
								<div className="flex items-center space-x-1">
									<span>Course</span>
									<ChevronDown className="w-4 h-4" />
								</div>
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Assessment
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Placement
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Status
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Last Activity
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{sortedStudents.map((student, index) => (
							<tr
								key={student._id}
								className="hover:bg-gray-50 transition-colors duration-200 group"
								style={{ animationDelay: `${index * 50}ms` }}>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="flex items-center">
										<div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
											<span className="text-sm font-medium text-white">
												{student.firstName[0]}
												{student.lastName[0]}
											</span>
										</div>
										<div className="ml-4">
											<div className="text-sm font-medium text-gray-900">
												{student.firstName} {student.lastName}
											</div>
											<div className="text-sm text-gray-500">
												{student.email}
											</div>
											<div className="text-xs text-gray-400">
												{student.studentId} • {student.rollNumber}
											</div>
										</div>
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="space-y-1">
										<span
											className={cn(
												"inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
												courseColors[
													student.course as keyof typeof courseColors
												] || "bg-gray-100 text-gray-800"
											)}>
											{student.course}
										</span>
										<div className="text-xs text-gray-500">
											Division {student.division}
											{student.yearOfStudy && ` • Year ${student.yearOfStudy}`}
										</div>
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									{student.latestAssessment ? (
										<div className="space-y-1">
											<div className="flex items-center space-x-2">
												<Award className="w-4 h-4 text-blue-600" />
												<span className="text-sm font-medium text-gray-900">
													{student.latestAssessment.overallScore.toFixed(1)}%
												</span>
											</div>
											<div className="text-xs text-gray-500">
												{formatDate(student.latestAssessment.assessmentDate)}
											</div>
											<div className="w-16 bg-gray-200 rounded-full h-1.5">
												<div
													className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
													style={{
														width: `${student.latestAssessment.overallScore}%`,
													}}></div>
											</div>
										</div>
									) : (
										<div className="text-sm text-gray-400 flex items-center">
											<Calendar className="w-4 h-4 mr-2" />
											Not assessed
										</div>
									)}
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									{student.latestAssessment ? (
										<span
											className={cn(
												"inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
												student.latestAssessment.placementRecommended
													? "bg-green-100 text-green-800"
													: "bg-yellow-100 text-yellow-800"
											)}>
											{student.latestAssessment.placementRecommended
												? "Recommended"
												: "Under Review"}
										</span>
									) : (
										<span className="text-sm text-gray-400">-</span>
									)}
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="flex items-center space-x-2">
										<span
											className={cn(
												"inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
												statusStyles[student.status]
											)}>
											{student.status.charAt(0).toUpperCase() +
												student.status.slice(1)}
										</span>
										{student.isFirstLogin && (
											<span className="inline-flex items-center px-1 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
												First Login
											</span>
										)}
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									<div className="flex items-center">
										<User className="w-4 h-4 mr-1" />
										{formatTimeAgo(student.lastLoginAt)}
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
									<div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
										<button
											className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-all duration-200"
											title="View Profile">
											<Eye className="w-4 h-4" />
										</button>
										<button
											className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50 transition-all duration-200"
											title="Edit Student">
											<Edit className="w-4 h-4" />
										</button>
										<button
											className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-all duration-200"
											title="Delete Student">
											<Trash2 className="w-4 h-4" />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className="px-6 py-4 border-t border-gray-200">
				<div className="flex items-center justify-between">
					<div className="text-sm text-gray-700">
						Showing <span className="font-medium">1</span> to{" "}
						<span className="font-medium">{sortedStudents.length}</span> of{" "}
						<span className="font-medium">{students.length}</span> results
					</div>
					<div className="flex items-center space-x-2">
						<button className="px-3 py-1 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
							Previous
						</button>
						<button className="px-3 py-1 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
							Next
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

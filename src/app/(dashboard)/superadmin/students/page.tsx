"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
	Search,
	Filter,
	Download,
	Eye,
	Edit,
	Trash2,
	Users,
	ChevronDown,
	ChevronUp,
	ArrowUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Student {
	_id: string;
	studentName: string;
	registrationNo: string;
	rollNo: string;
	email: string;
	site: string;
	batchName: string;
	academicSession: string;
	class: string;
	course: "MCA" | "MMS" | "PGDM";
	studentStatus: "Active" | "Inactive";
	createdAt: string;
	updatedAt: string;
}

interface Pagination {
	currentPage: number;
	totalPages: number;
	totalStudents: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
}

interface FilterOptions {
	sites: string[];
	batchNames: string[];
	academicSessions: string[];
	classes: string[];
	courses: string[];
	studentStatuses: string[];
}

interface StudentsResponse {
	students: Student[];
	pagination: Pagination;
	filterOptions: FilterOptions;
}

type SortField =
	| "studentName"
	| "registrationNo"
	| "rollNo"
	| "course"
	| "batchName"
	| "studentStatus"
	| "createdAt";
type SortOrder = "asc" | "desc";

export default function StudentsViewPage() {
	const [students, setStudents] = useState<Student[]>([]);
	const [pagination, setPagination] = useState<Pagination>({
		currentPage: 1,
		totalPages: 1,
		totalStudents: 0,
		hasNextPage: false,
		hasPrevPage: false,
	});
	const [filterOptions, setFilterOptions] = useState<FilterOptions>({
		sites: [],
		batchNames: [],
		academicSessions: [],
		classes: [],
		courses: [],
		studentStatuses: [],
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Filter states
	const [search, setSearch] = useState("");
	const [selectedSite, setSelectedSite] = useState("");
	const [selectedBatchName, setSelectedBatchName] = useState("");
	const [selectedAcademicSession, setSelectedAcademicSession] = useState("");
	const [selectedClass, setSelectedClass] = useState("");
	const [selectedCourse, setSelectedCourse] = useState("");
	const [selectedStudentStatus, setSelectedStudentStatus] = useState("");

	// Sorting states
	const [sortBy, setSortBy] = useState<SortField>("createdAt");
	const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

	// UI states
	const [showFilters, setShowFilters] = useState(false);
	const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

	const fetchStudents = useCallback(
		async (page: number = 1) => {
			try {
				setLoading(true);
				setError(null);

				const params = new URLSearchParams({
					page: page.toString(),
					limit: "20",
					sortBy,
					sortOrder,
				});

				if (search) params.append("search", search);
				if (selectedSite) params.append("site", selectedSite);
				if (selectedBatchName) params.append("batchName", selectedBatchName);
				if (selectedAcademicSession)
					params.append("academicSession", selectedAcademicSession);
				if (selectedClass) params.append("class", selectedClass);
				if (selectedCourse) params.append("course", selectedCourse);
				if (selectedStudentStatus)
					params.append("studentStatus", selectedStudentStatus);

				const response = await fetch(`/api/students/list?${params}`);

				if (!response.ok) {
					throw new Error("Failed to fetch students");
				}

				const data: StudentsResponse = await response.json();
				setStudents(data.students);
				setPagination(data.pagination);
				setFilterOptions(data.filterOptions);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to fetch students"
				);
			} finally {
				setLoading(false);
			}
		},
		[
			search,
			selectedSite,
			selectedBatchName,
			selectedAcademicSession,
			selectedClass,
			selectedCourse,
			selectedStudentStatus,
			sortBy,
			sortOrder,
		]
	);

	useEffect(() => {
		fetchStudents(1);
	}, [fetchStudents]);

	const handleSort = (field: SortField) => {
		if (sortBy === field) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortBy(field);
			setSortOrder("asc");
		}
	};

	const clearFilters = () => {
		setSearch("");
		setSelectedSite("");
		setSelectedBatchName("");
		setSelectedAcademicSession("");
		setSelectedClass("");
		setSelectedCourse("");
		setSelectedStudentStatus("");
	};

	const toggleStudentSelection = (studentId: string) => {
		setSelectedStudents((prev) =>
			prev.includes(studentId)
				? prev.filter((id) => id !== studentId)
				: [...prev, studentId]
		);
	};

	const toggleSelectAll = () => {
		if (selectedStudents.length === students.length) {
			setSelectedStudents([]);
		} else {
			setSelectedStudents(students.map((s) => s._id));
		}
	};

	const exportStudents = async () => {
		try {
			const params = new URLSearchParams({
				format: "csv",
				...(search && { search }),
				...(selectedSite && { site: selectedSite }),
				...(selectedBatchName && { batchName: selectedBatchName }),
				...(selectedAcademicSession && {
					academicSession: selectedAcademicSession,
				}),
				...(selectedClass && { class: selectedClass }),
				...(selectedCourse && { course: selectedCourse }),
				...(selectedStudentStatus && { studentStatus: selectedStudentStatus }),
			});

			const response = await fetch(`/api/students/export?${params}`);

			if (response.ok) {
				const blob = await response.blob();
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = `students-${new Date().toISOString().slice(0, 10)}.csv`;
				document.body.appendChild(a);
				a.click();
				window.URL.revokeObjectURL(url);
				document.body.removeChild(a);
			}
		} catch (error) {
			console.error("Error exporting students:", error);
		}
	};

	const SortableHeader = ({
		field,
		children,
	}: {
		field: SortField;
		children: React.ReactNode;
	}) => (
		<th
			className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
			onClick={() => handleSort(field)}>
			<div className="flex items-center space-x-1">
				<span>{children}</span>
				{sortBy === field ? (
					sortOrder === "asc" ? (
						<ChevronUp className="h-4 w-4" />
					) : (
						<ChevronDown className="h-4 w-4" />
					)
				) : (
					<ArrowUpDown className="h-4 w-4 opacity-50" />
				)}
			</div>
		</th>
	);

	if (loading && students.length === 0) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Students</h1>
					<p className="text-gray-600">
						{pagination.totalStudents} total students
					</p>
				</div>
				<div className="flex items-center space-x-3">
					<button
						onClick={exportStudents}
						className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
						<Download className="h-4 w-4 mr-2" />
						Export
					</button>
					<button
						onClick={() => setShowFilters(!showFilters)}
						className={cn(
							"inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium",
							showFilters
								? "border-blue-300 text-blue-700 bg-blue-50"
								: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
						)}>
						<Filter className="h-4 w-4 mr-2" />
						Filters
					</button>
				</div>
			</div>

			{/* Search */}
			<div className="relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
				<input
					type="text"
					placeholder="Search students by name, registration number, roll number, or email..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
			</div>

			{/* Filters */}
			{showFilters && (
				<div className="bg-white p-6 border rounded-lg shadow-sm">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Site
							</label>
							<select
								value={selectedSite}
								onChange={(e) => setSelectedSite(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
								<option value="">All Sites</option>
								{filterOptions.sites.map((site) => (
									<option
										key={site}
										value={site}>
										{site}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Course
							</label>
							<select
								value={selectedCourse}
								onChange={(e) => setSelectedCourse(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
								<option value="">All Courses</option>
								{filterOptions.courses.map((course) => (
									<option
										key={course}
										value={course}>
										{course}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Batch
							</label>
							<select
								value={selectedBatchName}
								onChange={(e) => setSelectedBatchName(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
								<option value="">All Batches</option>
								{filterOptions.batchNames.map((batch) => (
									<option
										key={batch}
										value={batch}>
										{batch}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Academic Session
							</label>
							<select
								value={selectedAcademicSession}
								onChange={(e) => setSelectedAcademicSession(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
								<option value="">All Sessions</option>
								{filterOptions.academicSessions.map((session) => (
									<option
										key={session}
										value={session}>
										{session}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Class
							</label>
							<select
								value={selectedClass}
								onChange={(e) => setSelectedClass(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
								<option value="">All Classes</option>
								{filterOptions.classes.map((cls) => (
									<option
										key={cls}
										value={cls}>
										{cls}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Status
							</label>
							<select
								value={selectedStudentStatus}
								onChange={(e) => setSelectedStudentStatus(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
								<option value="">All Statuses</option>
								{filterOptions.studentStatuses.map((status) => (
									<option
										key={status}
										value={status}>
										{status}
									</option>
								))}
							</select>
						</div>
					</div>

					<div className="mt-4 flex justify-end">
						<button
							onClick={clearFilters}
							className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
							Clear Filters
						</button>
					</div>
				</div>
			)}

			{/* Error message */}
			{error && (
				<div className="bg-red-50 border border-red-200 rounded-lg p-4">
					<p className="text-red-800">{error}</p>
				</div>
			)}

			{/* Students Table */}
			<div className="bg-white shadow-sm rounded-lg overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left">
									<input
										type="checkbox"
										checked={
											selectedStudents.length === students.length &&
											students.length > 0
										}
										onChange={toggleSelectAll}
										className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
									/>
								</th>
								<SortableHeader field="studentName">Name</SortableHeader>
								<SortableHeader field="registrationNo">
									Registration No
								</SortableHeader>
								<SortableHeader field="rollNo">Roll No</SortableHeader>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Email
								</th>
								<SortableHeader field="course">Course</SortableHeader>
								<SortableHeader field="batchName">Batch</SortableHeader>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Class
								</th>
								<SortableHeader field="studentStatus">Status</SortableHeader>
								<SortableHeader field="createdAt">Created</SortableHeader>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{students.map((student) => (
								<tr
									key={student._id}
									className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<input
											type="checkbox"
											checked={selectedStudents.includes(student._id)}
											onChange={() => toggleStudentSelection(student._id)}
											className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
										/>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm font-medium text-gray-900">
											{student.studentName}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{student.registrationNo}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{student.rollNo}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{student.email}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={cn(
												"inline-flex px-2 py-1 text-xs font-semibold rounded-full",
												student.course === "MCA"
													? "bg-blue-100 text-blue-800"
													: student.course === "MMS"
													? "bg-green-100 text-green-800"
													: "bg-purple-100 text-purple-800"
											)}>
											{student.course}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{student.batchName}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{student.class}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={cn(
												"inline-flex px-2 py-1 text-xs font-semibold rounded-full",
												student.studentStatus === "Active"
													? "bg-green-100 text-green-800"
													: "bg-red-100 text-red-800"
											)}>
											{student.studentStatus}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{new Date(student.createdAt).toLocaleDateString()}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<div className="flex items-center space-x-2">
											<button className="text-blue-600 hover:text-blue-900">
												<Eye className="h-4 w-4" />
											</button>
											<button className="text-gray-600 hover:text-gray-900">
												<Edit className="h-4 w-4" />
											</button>
											<button className="text-red-600 hover:text-red-900">
												<Trash2 className="h-4 w-4" />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Empty state */}
				{students.length === 0 && !loading && (
					<div className="text-center py-12">
						<Users className="mx-auto h-12 w-12 text-gray-400" />
						<h3 className="mt-2 text-sm font-medium text-gray-900">
							No students found
						</h3>
						<p className="mt-1 text-sm text-gray-500">
							{search ||
							selectedSite ||
							selectedBatchName ||
							selectedAcademicSession ||
							selectedClass ||
							selectedCourse ||
							selectedStudentStatus
								? "Try adjusting your search or filters."
								: "Get started by adding some students."}
						</p>
					</div>
				)}
			</div>

			{/* Pagination */}
			{pagination.totalPages > 1 && (
				<div className="flex items-center justify-between">
					<div className="text-sm text-gray-700">
						Showing {(pagination.currentPage - 1) * 20 + 1} to{" "}
						{Math.min(pagination.currentPage * 20, pagination.totalStudents)} of{" "}
						{pagination.totalStudents} results
					</div>
					<div className="flex items-center space-x-2">
						<button
							onClick={() => fetchStudents(pagination.currentPage - 1)}
							disabled={!pagination.hasPrevPage}
							className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
							Previous
						</button>
						<span className="px-3 py-2 text-sm font-medium text-gray-700">
							Page {pagination.currentPage} of {pagination.totalPages}
						</span>
						<button
							onClick={() => fetchStudents(pagination.currentPage + 1)}
							disabled={!pagination.hasNextPage}
							className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
							Next
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

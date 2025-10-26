"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Search, Eye, Edit, Trash2, User } from "lucide-react";
import { User as UserType } from "@/models/User";

interface StudentTableProps {
	students: UserType[];
	className?: string;
}

export default function StudentTable({
	students,
	className,
}: StudentTableProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [sortField, setSortField] = useState<keyof UserType>("firstName");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

	const filteredStudents = students.filter((student) => {
		const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
		const matchesSearch =
			fullName.includes(searchTerm.toLowerCase()) ||
			student.email.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesSearch;
	});

	const sortedStudents = [...filteredStudents].sort((a, b) => {
		const aValue = a[sortField];
		const bValue = b[sortField];

		if (typeof aValue === "string" && typeof bValue === "string") {
			return sortDirection === "asc"
				? aValue.localeCompare(bValue)
				: bValue.localeCompare(aValue);
		}

		if (aValue instanceof Date && bValue instanceof Date) {
			return sortDirection === "asc"
				? aValue.getTime() - bValue.getTime()
				: bValue.getTime() - aValue.getTime();
		}

		return 0;
	});

	const handleSort = (field: keyof UserType) => {
		if (sortField === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	};

	return (
		<div className={cn("bg-white rounded-lg shadow-sm", className)}>
			{/* Header with Search */}
			<div className="p-4 sm:p-6 border-b border-gray-200">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
					<div>
						<h2 className="text-lg font-semibold text-gray-900">Students</h2>
						<p className="text-xs sm:text-sm text-gray-500">
							{filteredStudents.length} of {students.length} students
						</p>
					</div>
				</div>

				{/* Search Bar */}
				<div className="relative">
					<Search className="absolute left-3 top-2.5 sm:top-3 h-4 w-4 text-gray-400" />
					<input
						type="text"
						placeholder="Search students..."
						className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</div>

			{/* Table */}
			<div className="overflow-x-auto">
				<table className="w-full min-w-[640px]">
					<thead>
						<tr className="border-b border-gray-200">
							<th className="text-left py-3 sm:py-4 px-3 sm:px-6">
								<button
									className="flex items-center space-x-1 text-xs sm:text-sm font-medium text-gray-900 hover:text-blue-600"
									onClick={() => handleSort("firstName")}>
									<span>Student</span>
									<ChevronDown className="h-4 w-4" />
								</button>
							</th>
							<th className="text-left py-3 sm:py-4 px-3 sm:px-6 hidden md:table-cell">
								<button
									className="flex items-center space-x-1 text-xs sm:text-sm font-medium text-gray-900 hover:text-blue-600"
									onClick={() => handleSort("email")}>
									<span>Email</span>
									<ChevronDown className="h-4 w-4" />
								</button>
							</th>
							<th className="text-left py-3 sm:py-4 px-3 sm:px-6 hidden lg:table-cell">
								<button
									className="flex items-center space-x-1 text-xs sm:text-sm font-medium text-gray-900 hover:text-blue-600"
									onClick={() => handleSort("role")}>
									<span>Role</span>
									<ChevronDown className="h-4 w-4" />
								</button>
							</th>
							<th className="text-left py-3 sm:py-4 px-3 sm:px-6 hidden lg:table-cell">
								<button
									className="flex items-center space-x-1 text-xs sm:text-sm font-medium text-gray-900 hover:text-blue-600"
									onClick={() => handleSort("createdAt")}>
									<span>Created</span>
									<ChevronDown className="h-4 w-4" />
								</button>
							</th>
							<th className="text-right py-3 sm:py-4 px-3 sm:px-6">
								<span className="text-xs sm:text-sm font-medium text-gray-900">
									Actions
								</span>
							</th>
						</tr>
					</thead>
					<tbody>
						{sortedStudents.map((student) => (
							<tr
								key={student._id?.toString()}
								className="border-b border-gray-100 hover:bg-gray-50">
								<td className="py-3 sm:py-4 px-3 sm:px-6">
									<div className="flex items-center space-x-2 sm:space-x-3">
										<div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
											<User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
										</div>
										<div className="min-w-0">
											<div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
												{student.firstName} {student.lastName}
											</div>
											<div className="text-xs text-gray-500 truncate md:hidden">
												{student.email}
											</div>
										</div>
									</div>
								</td>
								<td className="py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm text-gray-600 hidden md:table-cell">
									<div className="truncate max-w-xs">{student.email}</div>
								</td>
								<td className="py-3 sm:py-4 px-3 sm:px-6 hidden lg:table-cell">
									<span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
										{student.role}
									</span>
								</td>
								<td className="py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm text-gray-600 hidden lg:table-cell">
									{student.createdAt
										? new Date(student.createdAt).toLocaleDateString()
										: "N/A"}
								</td>
								<td className="py-3 sm:py-4 px-3 sm:px-6">
									<div className="flex items-center justify-end space-x-1 sm:space-x-2">
										<button
											className="p-1 text-gray-400 hover:text-blue-600"
											title="View">
											<Eye className="h-4 w-4" />
										</button>
										<button
											className="p-1 text-gray-400 hover:text-green-600"
											title="Edit">
											<Edit className="h-4 w-4" />
										</button>
										<button
											className="p-1 text-gray-400 hover:text-red-600"
											title="Delete">
											<Trash2 className="h-4 w-4" />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{filteredStudents.length === 0 && (
				<div className="text-center py-8 sm:py-12 px-4">
					<User className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
					<h3 className="mt-2 text-sm font-medium text-gray-900">
						No students found
					</h3>
					<p className="mt-1 text-xs sm:text-sm text-gray-500">
						Try adjusting your search criteria.
					</p>
				</div>
			)}
		</div>
	);
}

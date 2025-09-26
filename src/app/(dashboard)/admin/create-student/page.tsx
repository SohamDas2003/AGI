"use client";

import React, { useState, useRef, useEffect } from "react";
import {
	Upload,
	Download,
	Search,
	FileSpreadsheet,
	AlertCircle,
	CheckCircle,
	X,
	Eye,
	Edit,
	Trash2,
	Info,
	GraduationCap,
	UserPlus,
	Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Student } from "@/types";
import dropdownData from "@/lib/student-dropdown-data.json";

interface UploadResult {
	success: boolean;
	totalRecords: number;
	successfulImports: number;
	failedImports: number;
	errors: Array<{
		row: number;
		field: string;
		value: string;
		error: string;
	}>;
	reportData?: Array<{
		row: number;
		studentName: string;
		registrationNo: string;
		rollNo: string;
		email: string;
		status: "Success" | "Failed";
		errors: string[];
	}>;
}

interface StudentFormData {
	studentName: string;
	registrationNo: string;
	rollNo: string;
	site: string;
	batchName: string;
	academicSession: string;
	class: string;
	studentStatus: "Active" | "Inactive" | "Suspended";
}

const batchNames = dropdownData["Batch Name"];
const academicSessions = dropdownData["Academic Session"];
const classes = dropdownData["Class"];
const sites = dropdownData["Site"];
const studentStatuses = dropdownData["Student Status"];

// Real student data from CSV
const realStudents: Student[] = [
	{
		_id: "1",
		studentName: "MAYUR KETAN MAKWANA",
		registrationNo: "AIMSR/MCA/2024-26/62",
		rollNo: "AIMSR/MCA/2024-26/062",
		site: "AIMSR-Aditya Institute Of Management Studies & Research",
		batchName: "MCA 2024-26",
		academicSession: "SEMESTER III",
		class: "Batch 2",
		studentStatus: "Active",
		isFirstLogin: false,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: "2",
		studentName: "PRADEEP RANJIT YADAV",
		registrationNo: "AIMSR/MCA/2024-26/060",
		rollNo: "AIMSR/MCA/2024-26/059",
		site: "AIMSR-Aditya Institute Of Management Studies & Research",
		batchName: "MCA 2024-26",
		academicSession: "SEMESTER III",
		class: "Batch 2",
		studentStatus: "Active",
		isFirstLogin: true,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: "3",
		studentName: "ADITI KHARE",
		registrationNo: "AIMSR/MCA/2024-26/018",
		rollNo: "AIMSR/MCA/2024-26/017",
		site: "AIMSR-Aditya Institute Of Management Studies & Research",
		batchName: "MCA 2024-26",
		academicSession: "SEMESTER III",
		class: "Batch 1",
		studentStatus: "Active",
		isFirstLogin: false,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: "4",
		studentName: "ARMAN SALIM SHAIKH",
		registrationNo: "AIMSR/MCA/2024-26/044",
		rollNo: "AIMSR/MCA/2024-26/043",
		site: "AIMSR-Aditya Institute Of Management Studies & Research",
		batchName: "MCA 2024-26",
		academicSession: "SEMESTER III",
		class: "Batch 2",
		studentStatus: "Active",
		isFirstLogin: false,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: "5",
		studentName: "RISHABH PREMRAJ TIWARI",
		registrationNo: "AIMSR/MCA/2024-26/050",
		rollNo: "AIMSR/MCA/2024-26/049",
		site: "AIMSR-Aditya Institute Of Management Studies & Research",
		batchName: "MCA 2024-26",
		academicSession: "SEMESTER III",
		class: "Batch 2",
		studentStatus: "Active",
		isFirstLogin: false,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: "6",
		studentName: "SOHAM DEBNATH DAS",
		registrationNo: "AIMSR/MCA/2024-26/004",
		rollNo: "AIMSR/MCA/2024-26/004",
		site: "AIMSR-Aditya Institute Of Management Studies & Research",
		batchName: "MCA 2024-26",
		academicSession: "SEMESTER III",
		class: "Batch 1",
		studentStatus: "Active",
		isFirstLogin: false,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: "7",
		studentName: "KUSH JITENDRA ASRANI",
		registrationNo: "AIMSR/MCA/2024-26/001",
		rollNo: "AIMSR/MCA/2024-26/001",
		site: "AIMSR-Aditya Institute Of Management Studies & Research",
		batchName: "MCA 2024-26",
		academicSession: "SEMESTER III",
		class: "Batch 1",
		studentStatus: "Active",
		isFirstLogin: false,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: "8",
		studentName: "VARUN MEHUL DAVE",
		registrationNo: "AIMSR/MCA/2024-26/005",
		rollNo: "AIMSR/MCA/2024-26/005",
		site: "AIMSR-Aditya Institute Of Management Studies & Research",
		batchName: "MCA 2024-26",
		academicSession: "SEMESTER III",
		class: "Batch 1",
		studentStatus: "Active",
		isFirstLogin: true,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];

export default function StudentsPage() {
	const [students, setStudents] = useState<Student[]>(realStudents);
	const [filteredStudents, setFilteredStudents] =
		useState<Student[]>(realStudents);
	const [selectedBatch, setSelectedBatch] = useState<string>("all");
	const [selectedClass, setSelectedClass] = useState<string>("all");
	const [searchTerm, setSearchTerm] = useState("");

	const [currentView, setCurrentView] = useState<"overview" | "add" | "bulk">(
		"overview"
	);

	// Form states
	const [formData, setFormData] = useState<StudentFormData>({
		studentName: "",
		registrationNo: "",
		rollNo: "",
		site: "AIMSR-Aditya Institute Of Management Studies & Research",
		batchName: "",
		academicSession: "",
		class: "",
		studentStatus: "Active",
	});

	// Bulk upload states
	const [isDragging, setIsDragging] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Filter and search logic
	useEffect(() => {
		let filtered = students;

		if (selectedBatch !== "all") {
			filtered = filtered.filter(
				(student) => student.batchName === selectedBatch
			);
		}

		if (selectedClass !== "all") {
			filtered = filtered.filter((student) => student.class === selectedClass);
		}

		if (searchTerm) {
			filtered = filtered.filter(
				(student) =>
					student.studentName
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					student.registrationNo
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		setFilteredStudents(filtered);
	}, [students, selectedBatch, selectedClass, searchTerm]);

	// Get unique classes for current batch
	const getAvailableClasses = () => {
		const batchStudents =
			selectedBatch === "all"
				? students
				: students.filter((s) => s.batchName === selectedBatch);
		return [...new Set(batchStudents.map((s) => s.class))];
	};

	// Batch statistics
	const getBatchStats = () => {
		const stats = batchNames
			.map((batch) => {
				const batchStudents = students.filter((s) => s.batchName === batch);
				const classes = [...new Set(batchStudents.map((s) => s.class))];
				return {
					batch,
					totalStudents: batchStudents.length,
					classes: classes.length,
					activeStudents: batchStudents.filter(
						(s) => s.studentStatus === "Active"
					).length,
				};
			})
			.filter((stat) => stat.totalStudents > 0);
		return stats;
	};

	// Handle form submission
	const handleAddStudent = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.batchName) return;

		try {
			const newStudent: Student = {
				_id: (students.length + 1).toString(),
				...formData,
				isFirstLogin: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			setStudents([...students, newStudent]);
			setFormData({
				studentName: "",
				registrationNo: "",
				rollNo: "",
				site: "AIMSR-Aditya Institute Of Management Studies & Research",
				batchName: "",
				academicSession: "",
				class: "",
				studentStatus: "Active",
			});
			setCurrentView("overview");
			// Show success message
		} catch (error) {
			console.error("Error adding student:", error);
		}
	};

	// Bulk upload handlers
	const handleFileSelect = (file: File) => {
		setSelectedFile(file);
		setUploadResult(null);
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);

		const files = e.dataTransfer.files;
		if (files.length > 0) {
			const file = files[0];
			if (file.type === "text/csv" || file.name.endsWith(".csv")) {
				handleFileSelect(file);
			}
		}
	};

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			handleFileSelect(file);
		}
	};

	const handleBulkUpload = async () => {
		if (!selectedFile) return;

		setIsUploading(true);
		setUploadProgress(0);

		// Simulate upload progress
		const progressInterval = setInterval(() => {
			setUploadProgress((prev) => {
				if (prev >= 100) {
					clearInterval(progressInterval);
					return 100;
				}
				return prev + 10;
			});
		}, 200);

		try {
			const formData = new FormData();
			formData.append("file", selectedFile);

			const response = await fetch("/api/students/bulk-upload", {
				method: "POST",
				body: formData,
			});

			const result: UploadResult = await response.json();
			setUploadResult(result);
			setShowSuccessMessage(true);
			setTimeout(() => setShowSuccessMessage(false), 5000);
		} catch (error) {
			console.error("Upload error:", error);
		} finally {
			setIsUploading(false);
			setUploadProgress(0);
		}
	};

	const downloadReport = async () => {
		if (!uploadResult || !uploadResult.reportData) return;

		try {
			const response = await fetch("/api/students/bulk-upload/report", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ reportData: uploadResult.reportData }),
			});

			if (response.ok) {
				const blob = await response.blob();
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = `bulk-upload-report-${new Date()
					.toISOString()
					.slice(0, 10)}.csv`;
				document.body.appendChild(a);
				a.click();
				window.URL.revokeObjectURL(url);
				document.body.removeChild(a);
			}
		} catch (error) {
			console.error("Error downloading report:", error);
		}
	};

	const downloadTemplate = () => {
		// Create CSV content with new structure
		const csvContent = `Student Name,Registration No,Roll No,Site,Batch Name,Academic Session,Class,Student Status
SAMPLE STUDENT NAME,AIMSR/MCA/2024-26/XXX,AIMSR/MCA/2024-26/XXX,AIMSR-Aditya Institute Of Management Studies & Research,MCA 2024-26,SEMESTER III,Batch 1,Active`;

		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "student_template.csv";
		link.click();
		window.URL.revokeObjectURL(url);
	};

	const renderOverview = () => (
		<div className="space-y-6">
			{/* Batch Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{getBatchStats().map((stat) => (
					<div
						key={stat.batch}
						className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
						<div className="flex items-center justify-between mb-2">
							<div className="flex items-center gap-2">
								<GraduationCap className="h-5 w-5 text-blue-600" />
								<h3 className="font-medium text-gray-900">{stat.batch}</h3>
							</div>
							<span className="text-2xl font-bold text-blue-600">
								{stat.totalStudents}
							</span>
						</div>
						<div className="text-sm text-gray-600 space-y-1">
							<div className="flex justify-between">
								<span>Active Students:</span>
								<span className="font-medium text-green-600">
									{stat.activeStudents}
								</span>
							</div>
							<div className="flex justify-between">
								<span>Classes:</span>
								<span className="font-medium">{stat.classes}</span>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Action Buttons */}
			<div className="flex flex-col sm:flex-row gap-3">
				<button
					onClick={() => setCurrentView("add")}
					className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
					<UserPlus className="h-4 w-4" />
					Add Single Student
				</button>
				<button
					onClick={() => setCurrentView("bulk")}
					className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
					<Upload className="h-4 w-4" />
					Bulk Upload
				</button>
				<button
					onClick={downloadTemplate}
					className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
					<Download className="h-4 w-4" />
					Download Template
				</button>
			</div>

			{/* Filters */}
			<div className="bg-white rounded-lg border border-gray-200 p-4">
				<div className="flex flex-col lg:flex-row gap-4">
					<div className="flex-1">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<input
								type="text"
								placeholder="Search students..."
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
					</div>
					<div className="flex gap-3">
						<select
							className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							value={selectedBatch}
							onChange={(e) => setSelectedBatch(e.target.value)}>
							<option value="all">All Batches</option>
							{batchNames.map((batch) => (
								<option
									key={batch}
									value={batch}>
									{batch}
								</option>
							))}
						</select>
						<select
							className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							value={selectedClass}
							onChange={(e) => setSelectedClass(e.target.value)}>
							<option value="all">All Classes</option>
							{getAvailableClasses().map((classItem) => (
								<option
									key={classItem}
									value={classItem}>
									{classItem}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>

			{/* Students List */}
			<div className="space-y-4">
				{filteredStudents.length === 0 ? (
					<div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
						<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<Users className="w-8 h-8 text-gray-400" />
						</div>
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							No students found
						</h3>
						<p className="text-gray-500 mb-6">
							Get started by adding your first student or uploading a CSV file.
						</p>
						<div className="flex justify-center gap-3">
							<button
								onClick={() => setCurrentView("add")}
								className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
								Add Student
							</button>
							<button
								onClick={() => setCurrentView("bulk")}
								className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
								Bulk Upload
							</button>
						</div>
					</div>
				) : (
					<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
						<div className="px-6 py-4 border-b border-gray-200">
							<h3 className="text-lg font-medium text-gray-900">
								Students ({filteredStudents.length})
							</h3>
						</div>
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Student
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Batch & Class
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Registration & Roll No
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Academic Session
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
									{filteredStudents.map((student) => (
										<tr
											key={student._id}
											className="hover:bg-gray-50 transition-colors">
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center">
													<div className="flex-shrink-0 h-10 w-10">
														<div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
															<span className="text-blue-600 font-medium text-sm">
																{student.studentName.split(" ")[0][0]}
																{student.studentName.split(" ")[1]
																	? student.studentName.split(" ")[1][0]
																	: ""}
															</span>
														</div>
													</div>
													<div className="ml-4">
														<div className="text-sm font-medium text-gray-900">
															{student.studentName}
														</div>
														<div className="text-sm text-gray-500">
															{student.site}
														</div>
													</div>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm font-medium text-gray-900">
													{student.batchName}
												</div>
												<div className="text-sm text-gray-500">
													{student.class}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm text-gray-900">
													{student.registrationNo}
												</div>
												<div className="text-sm text-gray-500">
													{student.rollNo}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm text-gray-900">
													{student.academicSession}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex flex-col gap-1">
													<span
														className={cn(
															"inline-flex px-2 py-1 text-xs font-semibold rounded-full w-fit",
															student.studentStatus === "Active"
																? "bg-green-100 text-green-800"
																: "bg-red-100 text-red-800"
														)}>
														{student.studentStatus}
													</span>
													{student.isFirstLogin && (
														<span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 w-fit">
															First Login
														</span>
													)}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
												<div className="flex items-center gap-2">
													<button
														className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors"
														title="View Details">
														<Eye className="h-4 w-4" />
													</button>
													<button
														className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50 transition-colors"
														title="Edit Student">
														<Edit className="h-4 w-4" />
													</button>
													<button
														className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
														title="Delete Student">
														<Trash2 className="h-4 w-4" />
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>
		</div>
	);

	const renderAddForm = () => (
		<div className="max-w-2xl">
			<form
				onSubmit={handleAddStudent}
				className="space-y-6">
				<div className="bg-white rounded-lg border border-gray-200 p-6">
					<h3 className="text-lg font-medium text-gray-900 mb-4">
						Add New Student
					</h3>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Student Name
							</label>
							<input
								type="text"
								required
								value={formData.studentName}
								onChange={(e) =>
									setFormData({ ...formData, studentName: e.target.value })
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter full name"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Registration No
							</label>
							<input
								type="text"
								required
								value={formData.registrationNo}
								onChange={(e) =>
									setFormData({ ...formData, registrationNo: e.target.value })
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="e.g., AIMSR/MCA/2024-26/001"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Roll No
							</label>
							<input
								type="text"
								required
								value={formData.rollNo}
								onChange={(e) =>
									setFormData({ ...formData, rollNo: e.target.value })
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="e.g., AIMSR/MCA/2024-26/001"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Batch Name
							</label>
							<select
								required
								value={formData.batchName}
								onChange={(e) =>
									setFormData({ ...formData, batchName: e.target.value })
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
								<option value="">Select Batch</option>
								{batchNames.map((batch) => (
									<option
										key={batch}
										value={batch}>
										{batch}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Academic Session
							</label>
							<select
								required
								value={formData.academicSession}
								onChange={(e) =>
									setFormData({ ...formData, academicSession: e.target.value })
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
								<option value="">Select Session</option>
								{academicSessions.map((session) => (
									<option
										key={session}
										value={session}>
										{session}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Class
							</label>
							<select
								required
								value={formData.class}
								onChange={(e) =>
									setFormData({ ...formData, class: e.target.value })
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
								<option value="">Select Class</option>
								{classes.map((cls) => (
									<option
										key={cls}
										value={cls}>
										{cls}
									</option>
								))}
							</select>
						</div>

						<div className="md:col-span-2">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Site
							</label>
							<select
								required
								value={formData.site}
								onChange={(e) =>
									setFormData({ ...formData, site: e.target.value })
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
								<option value="">Select Site</option>
								{sites.map((site) => (
									<option
										key={site}
										value={site}>
										{site}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Student Status
							</label>
							<select
								value={formData.studentStatus}
								onChange={(e) =>
									setFormData({
										...formData,
										studentStatus: e.target.value as
											| "Active"
											| "Inactive"
											| "Suspended",
									})
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
								<option value="">Select Status</option>
								{studentStatuses.map((status) => (
									<option
										key={status}
										value={status}>
										{status}
									</option>
								))}
							</select>
						</div>
					</div>

					<div className="flex gap-3 mt-6">
						<button
							type="submit"
							className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
							Add Student
						</button>
						<button
							type="button"
							onClick={() => setCurrentView("overview")}
							className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
							Cancel
						</button>
					</div>
				</div>
			</form>
		</div>
	);

	const renderBulkUpload = () => (
		<div className="max-w-4xl">
			<div className="bg-white rounded-lg border border-gray-200 p-6">
				<h3 className="text-lg font-medium text-gray-900 mb-6">
					Bulk Student Upload
				</h3>

				{/* Instructions */}
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
					<div className="flex items-start gap-3">
						<Info className="h-5 w-5 text-blue-600 mt-0.5" />
						<div>
							<h4 className="font-medium text-blue-900 mb-2">
								Upload Instructions
							</h4>
							<ul className="text-sm text-blue-800 space-y-1">
								<li>• Download the CSV template first</li>
								<li>
									• Fill in all required fields (Student Name, Registration No,
									Roll No, etc.)
								</li>
								<li>
									• Ensure batch names match exactly with existing batches
								</li>
								<li>• Maximum file size: 5MB</li>
								<li>• Supported format: CSV only</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Download Template */}
				<div className="mb-6">
					<button
						onClick={downloadTemplate}
						className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
						<Download className="h-4 w-4" />
						Download CSV Template
					</button>
				</div>

				{/* File Upload Area */}
				<div
					className={cn(
						"border-2 border-dashed rounded-lg p-8 text-center transition-colors",
						isDragging
							? "border-blue-400 bg-blue-50"
							: "border-gray-300 hover:border-gray-400"
					)}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}>
					{selectedFile ? (
						<div className="space-y-4">
							<div className="flex items-center justify-center gap-3">
								<FileSpreadsheet className="h-8 w-8 text-green-600" />
								<div>
									<p className="font-medium text-gray-900">
										{selectedFile.name}
									</p>
									<p className="text-sm text-gray-500">
										{(selectedFile.size / 1024).toFixed(1)} KB
									</p>
								</div>
								<button
									onClick={() => setSelectedFile(null)}
									className="p-1 text-gray-400 hover:text-gray-600">
									<X className="h-4 w-4" />
								</button>
							</div>

							{!isUploading && (
								<button
									onClick={handleBulkUpload}
									className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
									Upload Students
								</button>
							)}
						</div>
					) : (
						<div className="space-y-4">
							<Upload className="h-12 w-12 text-gray-400 mx-auto" />
							<div>
								<p className="text-lg font-medium text-gray-900 mb-2">
									Drop your CSV file here
								</p>
								<p className="text-gray-500 mb-4">
									or click to browse and select a file
								</p>
								<input
									ref={fileInputRef}
									type="file"
									accept=".csv"
									onChange={handleFileInputChange}
									className="hidden"
								/>
								<button
									onClick={() => fileInputRef.current?.click()}
									className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
									Choose File
								</button>
							</div>
						</div>
					)}
				</div>

				{/* Upload Progress */}
				{isUploading && (
					<div className="mt-6">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm font-medium text-gray-700">
								Uploading...
							</span>
							<span className="text-sm text-gray-500">{uploadProgress}%</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-blue-600 h-2 rounded-full transition-all duration-300"
								style={{ width: `${uploadProgress}%` }}
							/>
						</div>
					</div>
				)}

				{/* Upload Results */}
				{uploadResult && (
					<div className="mt-6">
						<div
							className={cn(
								"border rounded-lg p-4",
								uploadResult.success
									? "border-green-200 bg-green-50"
									: "border-red-200 bg-red-50"
							)}>
							<div className="flex items-start gap-3">
								{uploadResult.success ? (
									<CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
								) : (
									<AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
								)}
								<div className="flex-1">
									<h4
										className={cn(
											"font-medium mb-2",
											uploadResult.success ? "text-green-900" : "text-red-900"
										)}>
										Upload {uploadResult.success ? "Completed" : "Failed"}
									</h4>
									<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
										<div>
											<p className="text-sm text-gray-600">Total Records</p>
											<p className="font-semibold">
												{uploadResult.totalRecords}
											</p>
										</div>
										<div>
											<p className="text-sm text-gray-600">Successful</p>
											<p className="font-semibold text-green-600">
												{uploadResult.successfulImports}
											</p>
										</div>
										<div>
											<p className="text-sm text-gray-600">Failed</p>
											<p className="font-semibold text-red-600">
												{uploadResult.failedImports}
											</p>
										</div>
									</div>

									{/* Download Report Button */}
									<div className="mb-4">
										<button
											onClick={downloadReport}
											className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
											<svg
												className="w-4 h-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
												/>
											</svg>
											Download Detailed Report
										</button>
									</div>

									{uploadResult.errors.length > 0 && (
										<div>
											<h5 className="font-medium text-gray-900 mb-2">
												Errors ({uploadResult.errors.length})
											</h5>
											<div className="space-y-2 max-h-32 overflow-y-auto">
												{uploadResult.errors.map((error, index) => (
													<div
														key={index}
														className="text-sm bg-white rounded p-2 border">
														<span className="font-medium">
															Row {error.row}:
														</span>{" "}
														{error.error} (Field: {error.field}, Value:{" "}
														{error.value})
													</div>
												))}
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Success Message */}
				{showSuccessMessage && (
					<div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
						<div className="flex items-center gap-3">
							<CheckCircle className="h-5 w-5 text-green-600" />
							<p className="text-green-800">
								Students uploaded successfully! Redirecting to overview...
							</p>
						</div>
					</div>
				)}

				<div className="mt-6">
					<button
						onClick={() => setCurrentView("overview")}
						className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
						Back to Overview
					</button>
				</div>
			</div>
		</div>
	);

	return (
		<div className="mx-auto max-w-7xl space-y-6">
			{/* Header */}
			<div className="mb-8">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Student Management
						</h1>
						<p className="text-gray-600">
							Manage students, add new students, and upload student data in bulk
						</p>
					</div>

					{/* View Navigation */}
					<div className="flex rounded-lg border border-gray-300 p-1 bg-white">
						<button
							onClick={() => setCurrentView("overview")}
							className={cn(
								"px-3 py-2 text-sm font-medium rounded-md transition-colors",
								currentView === "overview"
									? "bg-blue-600 text-white"
									: "text-gray-700 hover:text-gray-900"
							)}>
							Overview
						</button>
						<button
							onClick={() => setCurrentView("add")}
							className={cn(
								"px-3 py-2 text-sm font-medium rounded-md transition-colors",
								currentView === "add"
									? "bg-blue-600 text-white"
									: "text-gray-700 hover:text-gray-900"
							)}>
							Add Student
						</button>
						<button
							onClick={() => setCurrentView("bulk")}
							className={cn(
								"px-3 py-2 text-sm font-medium rounded-md transition-colors",
								currentView === "bulk"
									? "bg-blue-600 text-white"
									: "text-gray-700 hover:text-gray-900"
							)}>
							Bulk Upload
						</button>
					</div>
				</div>
			</div>

			{/* Content */}
			{currentView === "overview" && renderOverview()}
			{currentView === "add" && renderAddForm()}
			{currentView === "bulk" && renderBulkUpload()}
		</div>
	);
}

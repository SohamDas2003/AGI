"use client";

import React, { useState, useRef } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import {
	Upload,
	Download,
	FileSpreadsheet,
	AlertCircle,
	CheckCircle,
	X,
	Users,
	FileText,
	Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
}

export default function BulkUploadPage() {
	const [isDragging, setIsDragging] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const requiredFields = [
		{
			field: "student_id",
			description: "Unique student identifier",
			type: "String/Number",
			required: true,
		},
		{
			field: "roll_number",
			description: "Student roll number",
			type: "String",
			required: true,
		},
		{
			field: "email",
			description: "Student email address",
			type: "Email",
			required: true,
		},
		{
			field: "first_name",
			description: "Student's first name",
			type: "String",
			required: true,
		},
		{
			field: "last_name",
			description: "Student's last name",
			type: "String",
			required: true,
		},
		{
			field: "course",
			description: "Academic program (MBA/MCA/PGDM/etc.)",
			type: "String",
			required: true,
		},
		{
			field: "division",
			description: "Class division/section",
			type: "String",
			required: true,
		},
		{
			field: "password",
			description: "Default login password",
			type: "String",
			required: true,
		},
		{
			field: "phone",
			description: "Contact number",
			type: "String",
			required: false,
		},
		{
			field: "date_of_birth",
			description: "Birth date",
			type: "Date",
			required: false,
		},
		{ field: "gender", description: "Gender", type: "String", required: false },
		{
			field: "year_of_study",
			description: "Current academic year",
			type: "Number",
			required: false,
		},
	];

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

		const files = Array.from(e.dataTransfer.files);
		if (files.length > 0) {
			handleFileSelection(files[0]);
		}
	};

	const handleFileSelection = (file: File | null) => {
		if (
			file &&
			(file.type ===
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
				file.type === "text/csv" ||
				file.name.endsWith(".xlsx") ||
				file.name.endsWith(".csv"))
		) {
			setSelectedFile(file);
			setUploadResult(null);
		} else if (file) {
			alert("Please select a valid Excel (.xlsx) or CSV file");
		}
	};

	const handleUpload = async () => {
		if (!selectedFile) return;

		setIsUploading(true);
		setUploadProgress(0);

		try {
			const formData = new FormData();
			formData.append("file", selectedFile);

			// Simulate progress with a small delay
			const progressInterval = setInterval(() => {
				setUploadProgress((prev) => {
					if (prev >= 90) {
						clearInterval(progressInterval);
						return 90; // Stop at 90% until we get response
					}
					return prev + 10;
				});
			}, 100);

			const response = await fetch("/api/students/bulk-upload", {
				method: "POST",
				body: formData,
			});

			clearInterval(progressInterval);
			setUploadProgress(100);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Upload failed");
			}

			const result: UploadResult = await response.json();
			setUploadResult(result);

			// Show success message and reset file selection after successful upload
			if (result.success || result.successfulImports > 0) {
				setShowSuccessMessage(true);
				setTimeout(() => {
					setSelectedFile(null);
					if (fileInputRef.current) {
						fileInputRef.current.value = "";
					}
					setShowSuccessMessage(false);
				}, 3000);
			}
		} catch (error) {
			console.error("Upload error:", error);
			setUploadResult({
				success: false,
				totalRecords: 0,
				successfulImports: 0,
				failedImports: 1,
				errors: [
					{
						row: 1,
						field: "general",
						value: "",
						error: error instanceof Error ? error.message : "Upload failed",
					},
				],
			});
		} finally {
			setIsUploading(false);
			setUploadProgress(0);
		}
	};

	const downloadTemplate = () => {
		// Generate comprehensive CSV template with sample data
		const csvContent = [
			// Header row
			"student_id,roll_number,email,first_name,last_name,course,division,password,phone,date_of_birth,gender,year_of_study",
			// Sample data rows
			"AGI001,MBA2024001,john.doe@agi.edu.in,John,Doe,MBA,A,student123,+91-9876543210,1999-05-15,Male,1",
			"AGI002,MCA2024002,jane.smith@agi.edu.in,Jane,Smith,MCA,B,student123,+91-9876543211,1998-08-20,Female,2",
			"AGI003,PGDM2024003,alex.johnson@agi.edu.in,Alex,Johnson,PGDM,A,student123,+91-9876543212,1997-12-10,Male,1",
			"AGI004,BMS2024004,priya.patel@agi.edu.in,Priya,Patel,BMS,C,student123,+91-9876543213,2000-03-25,Female,3",
			"AGI005,MCA2024005,rahul.kumar@agi.edu.in,Rahul,Kumar,MCA,A,student123,+91-9876543214,1999-11-08,Male,2",
		].join("\\n");

		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "student_bulk_upload_template.csv";
		link.click();
		window.URL.revokeObjectURL(url);
	};

	return (
		<div className="flex h-screen bg-gray-50">
			<Sidebar />

			<div className="flex-1 flex flex-col overflow-hidden">
				<Header />

				<main className="flex-1 overflow-y-auto p-6">
					<div className="max-w-6xl mx-auto space-y-6">
						{/* Success Message */}
						{showSuccessMessage && (
							<div className="bg-green-50 border border-green-200 rounded-xl p-4">
								<div className="flex items-center space-x-3">
									<CheckCircle className="w-6 h-6 text-green-600" />
									<div>
										<h3 className="text-lg font-semibold text-green-900">
											Upload Successful!
										</h3>
										<p className="text-green-700">
											Student accounts have been created successfully.
										</p>
									</div>
								</div>
							</div>
						)}

						{/* Page Header */}
						<div className="mb-8">
							<h1 className="text-3xl font-bold text-gray-900 mb-2">
								Bulk Student Upload
							</h1>
							<p className="text-gray-600">
								Upload Excel or CSV files to create multiple student profiles
								automatically
							</p>
						</div>

						{/* Upload Instructions */}
						<div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
							<div className="flex items-start space-x-3">
								<Info className="w-6 h-6 text-blue-600 mt-0.5" />
								<div>
									<h3 className="text-lg font-semibold text-blue-900 mb-2">
										Upload Requirements
									</h3>
									<ul className="text-sm text-blue-800 space-y-1">
										<li>• File format: .xlsx or .csv</li>
										<li>• Maximum file size: 10MB</li>
										<li>• Maximum records: 1000 students per upload</li>
										<li>• First row must contain column headers</li>
										<li>• Email addresses and Student IDs must be unique</li>
									</ul>
								</div>
							</div>
						</div>

						<div className="grid lg:grid-cols-2 gap-6">
							{/* Upload Section */}
							<div className="space-y-6">
								{/* File Upload Area */}
								<div className="bg-white rounded-xl border border-gray-200 p-6">
									<h3 className="text-lg font-semibold text-gray-900 mb-4">
										Upload Student Data
									</h3>

									<div
										className={cn(
											"border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
											isDragging
												? "border-blue-400 bg-blue-50"
												: "border-gray-300 hover:border-gray-400"
										)}
										onDragOver={handleDragOver}
										onDragLeave={handleDragLeave}
										onDrop={handleDrop}>
										<Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
										<div className="space-y-2">
											<p className="text-lg font-medium text-gray-900">
												Drop your file here or{" "}
												<button
													onClick={() => fileInputRef.current?.click()}
													className="text-blue-600 hover:text-blue-700 underline">
													browse
												</button>
											</p>
											<p className="text-sm text-gray-500">
												Supports .xlsx and .csv files up to 10MB
											</p>
										</div>
									</div>

									<input
										ref={fileInputRef}
										type="file"
										accept=".xlsx,.csv"
										onChange={(e) =>
											handleFileSelection(e.target.files?.[0] || null)
										}
										className="hidden"
									/>

									{selectedFile && (
										<div className="mt-4 p-4 bg-gray-50 rounded-lg">
											<div className="flex items-center justify-between">
												<div className="flex items-center space-x-3">
													<FileSpreadsheet className="w-8 h-8 text-green-600" />
													<div>
														<p className="font-medium text-gray-900">
															{selectedFile.name}
														</p>
														<p className="text-sm text-gray-500">
															{(selectedFile.size / 1024 / 1024).toFixed(2)} MB
														</p>
													</div>
												</div>
												<button
													onClick={() => setSelectedFile(null)}
													className="text-gray-400 hover:text-gray-600">
													<X className="w-5 h-5" />
												</button>
											</div>
										</div>
									)}

									{/* Upload Progress */}
									{isUploading && (
										<div className="mt-4">
											<div className="flex items-center justify-between mb-2">
												<span className="text-sm font-medium text-gray-700">
													Uploading...
												</span>
												<span className="text-sm text-gray-500">
													{uploadProgress}%
												</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-2">
												<div
													className="bg-blue-600 h-2 rounded-full transition-all duration-300"
													style={{ width: `${uploadProgress}%` }}></div>
											</div>
										</div>
									)}

									{/* Action Buttons */}
									<div className="flex space-x-3 mt-6">
										<button
											onClick={handleUpload}
											disabled={!selectedFile || isUploading}
											className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center">
											<Upload className="w-5 h-5 mr-2" />
											{isUploading ? "Processing..." : "Upload Students"}
										</button>

										<button
											onClick={downloadTemplate}
											className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center">
											<Download className="w-5 h-5 mr-2" />
											Template
										</button>
									</div>
								</div>

								{/* Upload Results */}
								{uploadResult && (
									<div className="bg-white rounded-xl border border-gray-200 p-6">
										<div className="flex items-center space-x-3 mb-4">
											{uploadResult.success ? (
												<CheckCircle className="w-6 h-6 text-green-600" />
											) : (
												<AlertCircle className="w-6 h-6 text-red-600" />
											)}
											<h3 className="text-lg font-semibold text-gray-900">
												Upload Results
											</h3>
										</div>

										<div className="grid grid-cols-3 gap-4 mb-6">
											<div className="text-center p-3 bg-blue-50 rounded-lg">
												<Users className="w-6 h-6 text-blue-600 mx-auto mb-1" />
												<div className="text-2xl font-bold text-blue-900">
													{uploadResult.totalRecords}
												</div>
												<div className="text-sm text-blue-700">
													Total Records
												</div>
											</div>
											<div className="text-center p-3 bg-green-50 rounded-lg">
												<CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
												<div className="text-2xl font-bold text-green-900">
													{uploadResult.successfulImports}
												</div>
												<div className="text-sm text-green-700">Successful</div>
											</div>
											<div className="text-center p-3 bg-red-50 rounded-lg">
												<AlertCircle className="w-6 h-6 text-red-600 mx-auto mb-1" />
												<div className="text-2xl font-bold text-red-900">
													{uploadResult.failedImports}
												</div>
												<div className="text-sm text-red-700">Failed</div>
											</div>
										</div>

										{uploadResult.errors.length > 0 && (
											<div>
												<h4 className="font-medium text-gray-900 mb-3">
													Errors Found:
												</h4>
												<div className="space-y-2 max-h-40 overflow-y-auto">
													{uploadResult.errors.map((error, index) => (
														<div
															key={index}
															className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
															<div className="font-medium text-red-900">
																Row {error.row}
															</div>
															<div className="text-red-700">
																Field:{" "}
																<span className="font-medium">
																	{error.field}
																</span>{" "}
																({error.value}) - {error.error}
															</div>
														</div>
													))}
												</div>
											</div>
										)}
									</div>
								)}
							</div>

							{/* Field Requirements */}
							<div className="bg-white rounded-xl border border-gray-200 p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">
									Required Fields
								</h3>

								<div className="space-y-3">
									{requiredFields.map((field, index) => (
										<div
											key={index}
											className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
											<div className="flex-shrink-0">
												{field.required ? (
													<div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
												) : (
													<div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
												)}
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-center space-x-2">
													<code className="text-sm font-mono bg-gray-200 px-2 py-1 rounded">
														{field.field}
													</code>
													<span
														className={cn(
															"text-xs px-2 py-1 rounded-full",
															field.required
																? "bg-red-100 text-red-800"
																: "bg-gray-100 text-gray-600"
														)}>
														{field.required ? "Required" : "Optional"}
													</span>
												</div>
												<p className="text-sm text-gray-600 mt-1">
													{field.description}
												</p>
												<p className="text-xs text-gray-500 mt-1">
													Type: {field.type}
												</p>
											</div>
										</div>
									))}
								</div>

								<div className="mt-6 space-y-4">
									<div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
										<div className="flex items-start space-x-2">
											<FileText className="w-5 h-5 text-yellow-600 mt-0.5" />
											<div>
												<h4 className="font-medium text-yellow-900">
													Supported Courses
												</h4>
												<p className="text-sm text-yellow-800 mt-1">
													MBA, MCA, PGDM, BMS, B.Arch., BFA Applied Art, B.Voc.
													Interior Design, M.Arch
												</p>
											</div>
										</div>
									</div>

									<div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
										<div className="flex items-start space-x-2">
											<Info className="w-5 h-5 text-blue-600 mt-0.5" />
											<div>
												<h4 className="font-medium text-blue-900">
													Tips for Successful Upload
												</h4>
												<ul className="text-sm text-blue-800 mt-1 space-y-1">
													<li>• Use unique email addresses for each student</li>
													<li>
														• Student IDs must be unique across the system
													</li>
													<li>
														• Date format should be YYYY-MM-DD (e.g.,
														1999-05-15)
													</li>
													<li>• Phone numbers should include country code</li>
													<li>
														• Passwords will be hashed securely during upload
													</li>
												</ul>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { GraduationCap, ArrowLeft, Eye, EyeOff } from "lucide-react";

interface FormData {
	studentName: string;
	registrationNo: string;
	rollNo: string;
	site: string;
	batchName: string;
	academicSession: string;
	class: string;
	studentStatus: "Active" | "Inactive";
	email: string;
	password: string;
	confirmPassword: string;
}

function CreateStudentPage() {
	const router = useRouter();
	const [formData, setFormData] = useState<FormData>({
		studentName: "",
		registrationNo: "",
		rollNo: "",
		site: "",
		batchName: "",
		academicSession: "",
		class: "",
		studentStatus: "Active",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		// Clear errors when user starts typing
		if (error) setError("");
		if (success) setSuccess("");
	};

	const validateForm = (): boolean => {
		if (!formData.studentName.trim()) {
			setError("Student name is required");
			return false;
		}
		if (!formData.registrationNo.trim()) {
			setError("Registration number is required");
			return false;
		}
		if (!formData.rollNo.trim()) {
			setError("Roll number is required");
			return false;
		}
		if (!formData.site.trim()) {
			setError("Site is required");
			return false;
		}
		if (!formData.batchName.trim()) {
			setError("Batch name is required");
			return false;
		}
		if (!formData.academicSession.trim()) {
			setError("Academic session is required");
			return false;
		}
		if (!formData.class.trim()) {
			setError("Class is required");
			return false;
		}
		if (!formData.email.trim()) {
			setError("Email is required");
			return false;
		}
		if (!formData.password) {
			setError("Password is required");
			return false;
		}
		if (formData.password.length < 8) {
			setError("Password must be at least 8 characters long");
			return false;
		}
		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			return false;
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formData.email)) {
			setError("Please enter a valid email address");
			return false;
		}

		return true;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setLoading(true);
		setError("");
		setSuccess("");

		try {
			const response = await fetch("/api/students/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					studentName: formData.studentName.trim(),
					registrationNo: formData.registrationNo.trim(),
					rollNo: formData.rollNo.trim(),
					site: formData.site.trim(),
					batchName: formData.batchName.trim(),
					academicSession: formData.academicSession.trim(),
					class: formData.class.trim(),
					studentStatus: formData.studentStatus,
					email: formData.email.trim(),
					password: formData.password,
				}),
			});

			const data = await response.json();

			if (data.success) {
				setSuccess("Student created successfully!");
				setFormData({
					studentName: "",
					registrationNo: "",
					rollNo: "",
					site: "",
					batchName: "",
					academicSession: "",
					class: "",
					studentStatus: "Active",
					email: "",
					password: "",
					confirmPassword: "",
				});

				// Redirect to student list or dashboard after a short delay
				setTimeout(() => {
					router.push("/superadmin/dashboard");
				}, 2000);
			} else {
				setError(data.message || "Failed to create student");
			}
		} catch (error) {
			console.error("Error creating student:", error);
			setError("Network error. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex h-screen bg-gray-50">

			<div className="flex-1 flex flex-col overflow-hidden">

				<main className="flex-1 overflow-y-auto p-6">
					<div className="max-w-4xl mx-auto">
						{/* Header */}
						<div className="mb-8">
							<button
								onClick={() => router.back()}
								className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
								<ArrowLeft className="h-4 w-4 mr-2" />
								Back
							</button>

							<div className="flex items-center mb-2">
								<div className="p-3 rounded-full bg-green-100 mr-4">
									<GraduationCap className="h-6 w-6 text-green-600" />
								</div>
								<div>
									<h1 className="text-3xl font-bold text-gray-900">
										Create New Student
									</h1>
									<p className="text-gray-600">
										Add a new student to the AIMSR system
									</p>
								</div>
							</div>
						</div>

						{/* Form */}
						<div className="bg-white rounded-lg shadow p-6">
							<form
								onSubmit={handleSubmit}
								className="space-y-6">
								{/* Student Information */}
								<div>
									<h3 className="text-lg font-medium text-gray-900 mb-4">
										Student Information
									</h3>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="md:col-span-2">
											<label
												htmlFor="studentName"
												className="block text-sm font-medium text-gray-700 mb-2">
												Student Name <span className="text-red-500">*</span>
											</label>
											<input
												type="text"
												id="studentName"
												name="studentName"
												value={formData.studentName}
												onChange={handleInputChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
												placeholder="Enter full student name"
												required
											/>
										</div>

										<div>
											<label
												htmlFor="registrationNo"
												className="block text-sm font-medium text-gray-700 mb-2">
												Registration Number{" "}
												<span className="text-red-500">*</span>
											</label>
											<input
												type="text"
												id="registrationNo"
												name="registrationNo"
												value={formData.registrationNo}
												onChange={handleInputChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
												placeholder="Enter registration number"
												required
											/>
										</div>

										<div>
											<label
												htmlFor="rollNo"
												className="block text-sm font-medium text-gray-700 mb-2">
												Roll Number <span className="text-red-500">*</span>
											</label>
											<input
												type="text"
												id="rollNo"
												name="rollNo"
												value={formData.rollNo}
												onChange={handleInputChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
												placeholder="Enter roll number"
												required
											/>
										</div>
									</div>
								</div>

								{/* Academic Information */}
								<div>
									<h3 className="text-lg font-medium text-gray-900 mb-4">
										Academic Information
									</h3>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<label
												htmlFor="site"
												className="block text-sm font-medium text-gray-700 mb-2">
												Site <span className="text-red-500">*</span>
											</label>
											<input
												type="text"
												id="site"
												name="site"
												value={formData.site}
												onChange={handleInputChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
												placeholder="Enter site/campus"
												required
											/>
										</div>

										<div>
											<label
												htmlFor="batchName"
												className="block text-sm font-medium text-gray-700 mb-2">
												Batch Name <span className="text-red-500">*</span>
											</label>
											<input
												type="text"
												id="batchName"
												name="batchName"
												value={formData.batchName}
												onChange={handleInputChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
												placeholder="Enter batch name"
												required
											/>
										</div>

										<div>
											<label
												htmlFor="academicSession"
												className="block text-sm font-medium text-gray-700 mb-2">
												Academic Session <span className="text-red-500">*</span>
											</label>
											<input
												type="text"
												id="academicSession"
												name="academicSession"
												value={formData.academicSession}
												onChange={handleInputChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
												placeholder="e.g., 2024-2025"
												required
											/>
										</div>

										<div>
											<label
												htmlFor="class"
												className="block text-sm font-medium text-gray-700 mb-2">
												Class <span className="text-red-500">*</span>
											</label>
											<input
												type="text"
												id="class"
												name="class"
												value={formData.class}
												onChange={handleInputChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
												placeholder="Enter class/grade"
												required
											/>
										</div>

										<div>
											<label
												htmlFor="studentStatus"
												className="block text-sm font-medium text-gray-700 mb-2">
												Status <span className="text-red-500">*</span>
											</label>
											<select
												id="studentStatus"
												name="studentStatus"
												value={formData.studentStatus}
												onChange={handleInputChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
												required>
												<option value="Active">Active</option>
												<option value="Inactive">Inactive</option>
											</select>
										</div>
									</div>
								</div>

								{/* Login Information */}
								<div>
									<h3 className="text-lg font-medium text-gray-900 mb-4">
										Login Information
									</h3>

									<div className="grid grid-cols-1 gap-6">
										<div>
											<label
												htmlFor="email"
												className="block text-sm font-medium text-gray-700 mb-2">
												Email Address <span className="text-red-500">*</span>
											</label>
											<input
												type="email"
												id="email"
												name="email"
												value={formData.email}
												onChange={handleInputChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
												placeholder="Enter email address"
												required
											/>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div>
												<label
													htmlFor="password"
													className="block text-sm font-medium text-gray-700 mb-2">
													Password <span className="text-red-500">*</span>
												</label>
												<div className="relative">
													<input
														type={showPassword ? "text" : "password"}
														id="password"
														name="password"
														value={formData.password}
														onChange={handleInputChange}
														className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
														placeholder="Enter password (min. 8 characters)"
														required
													/>
													<button
														type="button"
														onClick={() => setShowPassword(!showPassword)}
														className="absolute inset-y-0 right-0 pr-3 flex items-center">
														{showPassword ? (
															<EyeOff className="h-4 w-4 text-gray-400" />
														) : (
															<Eye className="h-4 w-4 text-gray-400" />
														)}
													</button>
												</div>
											</div>

											<div>
												<label
													htmlFor="confirmPassword"
													className="block text-sm font-medium text-gray-700 mb-2">
													Confirm Password{" "}
													<span className="text-red-500">*</span>
												</label>
												<div className="relative">
													<input
														type={showConfirmPassword ? "text" : "password"}
														id="confirmPassword"
														name="confirmPassword"
														value={formData.confirmPassword}
														onChange={handleInputChange}
														className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
														placeholder="Confirm password"
														required
													/>
													<button
														type="button"
														onClick={() =>
															setShowConfirmPassword(!showConfirmPassword)
														}
														className="absolute inset-y-0 right-0 pr-3 flex items-center">
														{showConfirmPassword ? (
															<EyeOff className="h-4 w-4 text-gray-400" />
														) : (
															<Eye className="h-4 w-4 text-gray-400" />
														)}
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Error/Success Messages */}
								{error && (
									<div className="p-4 bg-red-50 border border-red-200 rounded-md">
										<p className="text-red-600 text-sm">{error}</p>
									</div>
								)}

								{success && (
									<div className="p-4 bg-green-50 border border-green-200 rounded-md">
										<p className="text-green-600 text-sm">{success}</p>
									</div>
								)}

								{/* Submit Button */}
								<div className="flex gap-4">
									<button
										type="submit"
										disabled={loading}
										className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
										{loading ? (
											<div className="flex items-center justify-center">
												<div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
												Creating Student...
											</div>
										) : (
											"Create Student"
										)}
									</button>

									<button
										type="button"
										onClick={() => router.back()}
										className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">
										Cancel
									</button>
								</div>
							</form>
						</div>

						{/* Additional Info */}
						<div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
							<h3 className="text-sm font-medium text-blue-800 mb-2">
								Student Account Features
							</h3>
							<ul className="text-sm text-blue-700 space-y-1">
								<li>• Access to personal dashboard and assessments</li>
								<li>• View assessment results and progress tracking</li>
								<li>• Receive placement recommendations</li>
								<li>• Update profile information</li>
							</ul>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}

export default function ProtectedCreateStudentPage() {
	return (
		<ProtectedRoute allowedRoles={["SUPERADMIN"]}>
			<CreateStudentPage />
		</ProtectedRoute>
	);
}

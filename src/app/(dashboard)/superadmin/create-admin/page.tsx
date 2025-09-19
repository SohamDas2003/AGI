"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Shield, ArrowLeft, Eye, EyeOff } from "lucide-react";

interface FormData {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
}

function CreateAdminPage() {
	const router = useRouter();
	const [formData, setFormData] = useState<FormData>({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
		if (!formData.firstName.trim()) {
			setError("First name is required");
			return false;
		}
		if (!formData.lastName.trim()) {
			setError("Last name is required");
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
			const response = await fetch("/api/admins", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					firstName: formData.firstName.trim(),
					lastName: formData.lastName.trim(),
					email: formData.email.trim(),
					password: formData.password,
				}),
			});

			const data = await response.json();

			if (data.success) {
				setSuccess("Admin created successfully!");
				setFormData({
					firstName: "",
					lastName: "",
					email: "",
					password: "",
					confirmPassword: "",
				});

				// Redirect to admin list or dashboard after a short delay
				setTimeout(() => {
					router.push("/superadmin/dashboard");
				}, 2000);
			} else {
				setError(data.message || "Failed to create admin");
			}
		} catch (error) {
			console.error("Error creating admin:", error);
			setError("Network error. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex h-screen bg-gray-50">

			<div className="flex-1 flex flex-col overflow-hidden">

				<main className="flex-1 overflow-y-auto p-6">
					<div className="max-w-2xl mx-auto">
						{/* Header */}
						<div className="mb-8">
							<button
								onClick={() => router.back()}
								className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
								<ArrowLeft className="h-4 w-4 mr-2" />
								Back
							</button>

							<div className="flex items-center mb-2">
								<div className="p-3 rounded-full bg-purple-100 mr-4">
									<Shield className="h-6 w-6 text-purple-600" />
								</div>
								<div>
									<h1 className="text-3xl font-bold text-gray-900">
										Create New Administrator
									</h1>
									<p className="text-gray-600">
										Add a new administrator to the AIMSR system
									</p>
								</div>
							</div>
						</div>

						{/* Form */}
						<div className="bg-white rounded-lg shadow p-6">
							<form
								onSubmit={handleSubmit}
								className="space-y-6">
								{/* Name Fields */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<label
											htmlFor="firstName"
											className="block text-sm font-medium text-gray-700 mb-2">
											First Name <span className="text-red-500">*</span>
										</label>
										<input
											type="text"
											id="firstName"
											name="firstName"
											value={formData.firstName}
											onChange={handleInputChange}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
											placeholder="Enter first name"
											required
										/>
									</div>

									<div>
										<label
											htmlFor="lastName"
											className="block text-sm font-medium text-gray-700 mb-2">
											Last Name <span className="text-red-500">*</span>
										</label>
										<input
											type="text"
											id="lastName"
											name="lastName"
											value={formData.lastName}
											onChange={handleInputChange}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
											placeholder="Enter last name"
											required
										/>
									</div>
								</div>

								{/* Email */}
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
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
										placeholder="Enter email address"
										required
									/>
								</div>

								{/* Password */}
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
											className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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

								{/* Confirm Password */}
								<div>
									<label
										htmlFor="confirmPassword"
										className="block text-sm font-medium text-gray-700 mb-2">
										Confirm Password <span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<input
											type={showConfirmPassword ? "text" : "password"}
											id="confirmPassword"
											name="confirmPassword"
											value={formData.confirmPassword}
											onChange={handleInputChange}
											className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
										className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
										{loading ? (
											<div className="flex items-center justify-center">
												<div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
												Creating Admin...
											</div>
										) : (
											"Create Administrator"
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
								Administrator Privileges
							</h3>
							<ul className="text-sm text-blue-700 space-y-1">
								<li>• Can manage students and their data</li>
								<li>• Can create and manage assessments</li>
								<li>• Can view reports and analytics</li>
								<li>• Can manage placement recommendations</li>
							</ul>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}

export default function ProtectedCreateAdminPage() {
	return (
		<ProtectedRoute allowedRoles={["SUPERADMIN"]}>
			<CreateAdminPage />
		</ProtectedRoute>
	);
}

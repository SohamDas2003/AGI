"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
	Eye,
	EyeOff,
	GraduationCap,
	Lock,
	Mail,
	ArrowLeft,
} from "lucide-react";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		// Simulate login delay
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Check credentials
		if (email === "admin@agi.com" && password === "admin123") {
			router.push("/dashboard");
		} else {
			setError("Invalid email or password. Please try again.");
		}
		setIsLoading(false);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Back to Home */}
				<button
					onClick={() => router.push("/")}
					className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-8 group">
					<ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
					Back to Home
				</button>

				{/* Header */}
				<div className="text-center mb-8 animate-fade-in-up">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4 shadow-lg">
						<GraduationCap className="w-8 h-8 text-white" />
					</div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Welcome Back
					</h1>
					<p className="text-gray-600">Sign in to access your dashboard</p>
				</div>

				{/* Login Form */}
				<div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-fade-in-up">
					<form
						onSubmit={handleLogin}
						className="space-y-6">
						{/* Email Field */}
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 mb-2">
								Email Address
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Mail className="h-5 w-5 text-gray-400" />
								</div>
								<input
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
									placeholder="Enter your email"
									required
								/>
							</div>
						</div>

						{/* Password Field */}
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700 mb-2">
								Password
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Lock className="h-5 w-5 text-gray-400" />
								</div>
								<input
									id="password"
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
									placeholder="Enter your password"
									required
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute inset-y-0 right-0 pr-3 flex items-center">
									{showPassword ? (
										<EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
									) : (
										<Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
									)}
								</button>
							</div>
						</div>

						{/* Error Message */}
						{error && (
							<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
								{error}
							</div>
						)}

						{/* Login Button */}
						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] shadow-lg hover:shadow-xl">
							{isLoading ? (
								<div className="flex items-center justify-center">
									<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
									Signing In...
								</div>
							) : (
								"Sign In"
							)}
						</button>
					</form>

					{/* Demo Credentials */}
					<div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
						<p className="text-sm font-medium text-gray-700 mb-2">
							Demo Credentials:
						</p>
						<div className="space-y-1 text-sm text-gray-600">
							<p>
								<strong>Email:</strong> admin@agi.com
							</p>
							<p>
								<strong>Password:</strong> admin123
							</p>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="text-center mt-8">
					<p className="text-sm text-gray-500">
						© 2025 Aditya Group Of Institutions. All rights reserved.
					</p>
				</div>
			</div>
		</div>
	);
}

"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
	ArrowLeft,
	Lock,
	Eye,
	EyeOff,
	CheckCircle,
	AlertCircle,
} from "lucide-react";

function ResetPasswordForm() {
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isVerifying, setIsVerifying] = useState(true);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [tokenValid, setTokenValid] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	// Verify token on mount
	useEffect(() => {
		const verifyToken = async () => {
			if (!token) {
				setError("No reset token provided");
				setIsVerifying(false);
				return;
			}

			try {
				const response = await fetch(`/api/auth/reset-password?token=${token}`);
				const data = await response.json();

				if (data.valid) {
					setTokenValid(true);
				} else {
					setError(data.message || "Invalid or expired reset token");
				}
			} catch (error) {
				console.error("Token verification error:", error);
				setError("Failed to verify reset token");
			} finally {
				setIsVerifying(false);
			}
		};

		verifyToken();
	}, [token]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		// Validation
		if (newPassword.length < 8) {
			setError("Password must be at least 8 characters long");
			setIsLoading(false);
			return;
		}

		if (newPassword !== confirmPassword) {
			setError("Passwords do not match");
			setIsLoading(false);
			return;
		}

		try {
			const response = await fetch("/api/auth/reset-password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					token,
					newPassword,
				}),
			});

			const data = await response.json();

			if (data.success) {
				setSuccess(true);
				// Redirect to login after 3 seconds
				setTimeout(() => {
					router.push("/login");
				}, 3000);
			} else {
				setError(data.message || "Failed to reset password. Please try again.");
			}
		} catch (error) {
			console.error("Reset password error:", error);
			setError("An error occurred. Please try again later.");
		} finally {
			setIsLoading(false);
		}
	};

	// Loading state
	if (isVerifying) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-4">
				<div className="text-center">
					<svg
						className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24">
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						/>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						/>
					</svg>
					<p className="text-gray-600">Verifying reset token...</p>
				</div>
			</div>
		);
	}

	// Invalid token state
	if (!tokenValid) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-4">
				<div className="w-full max-w-md">
					<button
						onClick={() => router.push("/login")}
						className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-8 group">
						<ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
						Back to Login
					</button>

					<div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
						<div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
							<AlertCircle className="w-8 h-8 text-red-600" />
						</div>
						<h2 className="text-2xl font-bold text-gray-900 mb-2">
							Invalid or Expired Link
						</h2>
						<p className="text-gray-600 mb-6">{error}</p>
						<button
							onClick={() => router.push("/forgot-password")}
							className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
							Request a new password reset link
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Back to Login */}
				<button
					onClick={() => router.push("/login")}
					className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-8 group">
					<ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
					Back to Login
				</button>

				{/* Header */}
				<div className="text-center mb-8 animate-fade-in-up">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4 shadow-lg">
						<Lock className="w-8 h-8 text-white" />
					</div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Reset Your Password
					</h1>
					<p className="text-gray-600">
						Choose a new password for your account
					</p>
				</div>

				{/* Form Card */}
				<div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-fade-in-up">
					{success ? (
						<div className="text-center">
							<div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
								<CheckCircle className="w-8 h-8 text-green-600" />
							</div>
							<h2 className="text-2xl font-bold text-gray-900 mb-2">
								Password Reset Successful!
							</h2>
							<p className="text-gray-600 mb-4">
								Your password has been updated successfully.
							</p>
							<p className="text-sm text-gray-500">
								Redirecting to login page...
							</p>
						</div>
					) : (
						<form
							onSubmit={handleSubmit}
							className="space-y-6">
							{/* New Password Field */}
							<div>
								<label
									htmlFor="newPassword"
									className="block text-sm font-medium text-gray-700 mb-2">
									New Password
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<Lock className="h-5 w-5 text-gray-400" />
									</div>
									<input
										id="newPassword"
										name="newPassword"
										type={showPassword ? "text" : "password"}
										autoComplete="new-password"
										required
										value={newPassword}
										onChange={(e) => setNewPassword(e.target.value)}
										className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors sm:text-sm"
										placeholder="Enter new password (min 8 characters)"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute inset-y-0 right-0 pr-3 flex items-center">
										{showPassword ? (
											<EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
										) : (
											<Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
										)}
									</button>
								</div>
								<p className="mt-1 text-xs text-gray-500">
									Must be at least 8 characters long
								</p>
							</div>

							{/* Confirm Password Field */}
							<div>
								<label
									htmlFor="confirmPassword"
									className="block text-sm font-medium text-gray-700 mb-2">
									Confirm Password
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<Lock className="h-5 w-5 text-gray-400" />
									</div>
									<input
										id="confirmPassword"
										name="confirmPassword"
										type={showConfirmPassword ? "text" : "password"}
										autoComplete="new-password"
										required
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors sm:text-sm"
										placeholder="Confirm your new password"
									/>
									<button
										type="button"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										className="absolute inset-y-0 right-0 pr-3 flex items-center">
										{showConfirmPassword ? (
											<EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
										) : (
											<Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
										)}
									</button>
								</div>
							</div>

							{/* Error Message */}
							{error && (
								<div className="rounded-md bg-red-50 p-4 animate-fade-in">
									<div className="flex">
										<div className="ml-3">
											<h3 className="text-sm font-medium text-red-800">
												{error}
											</h3>
										</div>
									</div>
								</div>
							)}

							{/* Submit Button */}
							<button
								type="submit"
								disabled={isLoading}
								className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">
								{isLoading ? (
									<>
										<svg
											className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24">
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											/>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											/>
										</svg>
										Resetting...
									</>
								) : (
									"Reset Password"
								)}
							</button>
						</form>
					)}
				</div>

				{/* Security Note */}
				<div className="mt-8 text-center">
					<p className="text-sm text-gray-600">
						🔒 Your password will be securely encrypted
					</p>
				</div>
			</div>
		</div>
	);
}

export default function ResetPasswordPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-4">
					<div className="text-center">
						<svg
							className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24">
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							/>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
						<p className="text-gray-600">Loading...</p>
					</div>
				</div>
			}>
			<ResetPasswordForm />
		</Suspense>
	);
}

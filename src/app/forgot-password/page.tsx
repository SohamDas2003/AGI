"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");
		setSuccess(false);

		try {
			const response = await fetch("/api/auth/forgot-password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});

			const data = await response.json();

			if (data.success) {
				setSuccess(true);
				setEmail("");
			} else {
				setError(
					data.message || "Failed to send reset email. Please try again."
				);
			}
		} catch (error) {
			console.error("Forgot password error:", error);
			setError("An error occurred. Please try again later.");
		} finally {
			setIsLoading(false);
		}
	};

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
						<Mail className="w-8 h-8 text-white" />
					</div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Forgot Password?
					</h1>
					<p className="text-gray-600">
						Enter your email address and we&apos;ll send you a link to reset
						your password
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
								Check Your Email
							</h2>
							<p className="text-gray-600 mb-6">
								If an account exists with the provided email, you will receive a
								password reset link shortly.
							</p>
							<p className="text-sm text-gray-500 mb-6">
								Didn&apos;t receive the email? Check your spam folder or try
								again.
							</p>
							<button
								onClick={() => setSuccess(false)}
								className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
								Send another link
							</button>
						</div>
					) : (
						<form
							onSubmit={handleSubmit}
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
										name="email"
										type="email"
										autoComplete="email"
										required
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors sm:text-sm"
										placeholder="Enter your email"
									/>
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
										Sending...
									</>
								) : (
									"Send Reset Link"
								)}
							</button>
						</form>
					)}

					{/* Footer */}
					<div className="mt-6 text-center">
						<p className="text-xs text-gray-500">
							Remember your password?{" "}
							<button
								onClick={() => router.push("/login")}
								className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
								Sign in
							</button>
						</p>
					</div>
				</div>

				{/* Security Note */}
				<div className="mt-8 text-center">
					<p className="text-sm text-gray-600">
						🔒 Your account security is important to us
					</p>
				</div>
			</div>
		</div>
	);
}

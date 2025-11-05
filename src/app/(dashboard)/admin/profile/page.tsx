"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import {
	User as UserIcon,
	Mail,
	Lock,
	Eye,
	EyeOff,
	Save,
	CheckCircle,
	AlertCircle,
	Shield,
	Hash,
} from "lucide-react";

interface AccountData {
	email: string;
	role: "SUPERADMIN" | "ADMIN" | "STUDENT";
	firstName?: string;
	lastName?: string;
	userId?: string;
}

function AdminProfilePage() {
	const { user } = useAuth();
	const [account, setAccount] = useState<AccountData | null>(null);
	const [loading, setLoading] = useState(true);

	// Password change state
	const [showChangePassword, setShowChangePassword] = useState(false);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [passwordError, setPasswordError] = useState("");
	const [passwordSuccess, setPasswordSuccess] = useState("");
	const [isChangingPassword, setIsChangingPassword] = useState(false);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await fetch("/api/auth/me", { credentials: "include" });
				if (res.ok) {
					const data = await res.json();
					if (data?.user) {
						setAccount(data.user);
					}
				}
			} catch (e) {
				console.error("Failed to load user:", e);
			} finally {
				setLoading(false);
			}
		};
		fetchUser();
	}, []);

	const handlePasswordChange = async (e: React.FormEvent) => {
		e.preventDefault();
		setPasswordError("");
		setPasswordSuccess("");

		if (newPassword.length < 8) {
			setPasswordError("New password must be at least 8 characters long");
			return;
		}
		if (newPassword !== confirmPassword) {
			setPasswordError("New passwords do not match");
			return;
		}

		setIsChangingPassword(true);
		try {
			const response = await fetch("/api/auth/change-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ currentPassword, newPassword }),
			});
			const data = await response.json();
			if (data.success) {
				setPasswordSuccess("Password changed successfully!");
				setCurrentPassword("");
				setNewPassword("");
				setConfirmPassword("");
				setTimeout(() => {
					setShowChangePassword(false);
					setPasswordSuccess("");
				}, 2000);
			} else {
				setPasswordError(data.message || "Failed to change password");
			}
		} catch (error) {
			console.error("Error changing password:", error);
			setPasswordError("An error occurred. Please try again.");
		} finally {
			setIsChangingPassword(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading profile...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-5xl mx-auto space-y-6">
			{/* Page Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
				<p className="text-gray-600">View and manage your account</p>
			</div>

			{/* Profile Information Card */}
			<div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
				{/* Header with gradient */}
				<div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
					<div className="flex items-center space-x-4">
						<div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
							<UserIcon className="w-10 h-10 text-blue-600" />
						</div>
						<div className="text-white">
							<h2 className="text-2xl font-bold">
								{account?.firstName || user?.firstName || "User"}{" "}
								{account?.lastName || user?.lastName || ""}
							</h2>
							<p className="text-blue-100 flex items-center gap-2 mt-1">
								<Mail className="w-4 h-4" />
								{account?.email || user?.email}
							</p>
						</div>
					</div>
				</div>

				{/* Account Information */}
				<div className="px-8 py-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
						<Shield className="w-5 h-5 text-blue-600" />
						Account Information
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="flex items-start space-x-3">
							<Shield className="w-5 h-5 text-gray-400 mt-0.5" />
							<div>
								<p className="text-sm font-medium text-gray-600">Role</p>
								<p className="text-base text-gray-900 font-medium">
									{account?.role || user?.role}
								</p>
							</div>
						</div>
						<div className="flex items-start space-x-3">
							<Hash className="w-5 h-5 text-gray-400 mt-0.5" />
							<div>
								<p className="text-sm font-medium text-gray-600">User ID</p>
								<p className="text-base text-gray-900 font-medium">
									{account?.userId || "—"}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Security Settings Card */}
			<div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
				<div className="px-8 py-6 border-b border-gray-200">
					<h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
						<Lock className="w-5 h-5 text-blue-600" />
						Security Settings
					</h3>
				</div>

				<div className="px-8 py-6">
					{!showChangePassword ? (
						<div>
							<p className="text-gray-600 mb-4">
								Use a strong password to keep your account secure.
							</p>
							<button
								onClick={() => setShowChangePassword(true)}
								className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
								<Lock className="w-4 h-4 mr-2" />
								Change Password
							</button>
						</div>
					) : (
						<div>
							<div className="flex items-center justify-between mb-4">
								<h4 className="text-base font-semibold text-gray-900">
									Change Your Password
								</h4>
								<button
									onClick={() => {
										setShowChangePassword(false);
										setPasswordError("");
										setPasswordSuccess("");
										setCurrentPassword("");
										setNewPassword("");
										setConfirmPassword("");
									}}
									className="text-sm text-gray-600 hover:text-gray-800">
									Cancel
								</button>
							</div>

							<form
								onSubmit={handlePasswordChange}
								className="space-y-4">
								{/* Current Password */}
								<div>
									<label
										htmlFor="currentPassword"
										className="block text-sm font-medium text-gray-700 mb-2">
										Current Password
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<Lock className="h-5 w-5 text-gray-400" />
										</div>
										<input
											id="currentPassword"
											name="currentPassword"
											type={showCurrentPassword ? "text" : "password"}
											required
											value={currentPassword}
											onChange={(e) => setCurrentPassword(e.target.value)}
											className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
											placeholder="Enter current password"
										/>
										<button
											type="button"
											onClick={() =>
												setShowCurrentPassword(!showCurrentPassword)
											}
											className="absolute inset-y-0 right-0 pr-3 flex items-center">
											{showCurrentPassword ? (
												<EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
											) : (
												<Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
											)}
										</button>
									</div>
								</div>

								{/* New Password */}
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
											type={showNewPassword ? "text" : "password"}
											required
											value={newPassword}
											onChange={(e) => setNewPassword(e.target.value)}
											className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
											placeholder="Enter new password (min 8 characters)"
										/>
										<button
											type="button"
											onClick={() => setShowNewPassword(!showNewPassword)}
											className="absolute inset-y-0 right-0 pr-3 flex items-center">
											{showNewPassword ? (
												<EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
											) : (
												<Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
											)}
										</button>
									</div>
									<p className="mt-1 text-xs text-gray-500">
										Must be at least 8 characters long
									</p>
								</div>

								{/* Confirm Password */}
								<div>
									<label
										htmlFor="confirmPassword"
										className="block text-sm font-medium text-gray-700 mb-2">
										Confirm New Password
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<Lock className="h-5 w-5 text-gray-400" />
										</div>
										<input
											id="confirmPassword"
											name="confirmPassword"
											type={showConfirmPassword ? "text" : "password"}
											required
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
											className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
											placeholder="Confirm your new password"
										/>
										<button
											type="button"
											onClick={() =>
												setShowConfirmPassword(!showConfirmPassword)
											}
											className="absolute inset-y-0 right-0 pr-3 flex items-center">
											{showConfirmPassword ? (
												<EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
											) : (
												<Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
											)}
										</button>
									</div>
								</div>

								{/* Error Message */}
								{passwordError && (
									<div className="rounded-lg bg-red-50 p-4 animate-fade-in border border-red-200">
										<div className="flex">
											<AlertCircle className="h-5 w-5 text-red-600 mr-2" />
											<p className="text-sm font-medium text-red-800">
												{passwordError}
											</p>
										</div>
									</div>
								)}

								{/* Success Message */}
								{passwordSuccess && (
									<div className="rounded-lg bg-green-50 p-4 animate-fade-in border border-green-200">
										<div className="flex">
											<CheckCircle className="h-5 w-5 text-green-600 mr-2" />
											<p className="text-sm font-medium text-green-800">
												{passwordSuccess}
											</p>
										</div>
									</div>
								)}

								{/* Submit Button */}
								<button
									type="submit"
									disabled={isChangingPassword}
									className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">
									{isChangingPassword ? (
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
											Changing Password...
										</>
									) : (
										<>
											<Save className="w-4 h-4 mr-2" />
											Change Password
										</>
									)}
								</button>
							</form>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default function ProtectedAdminProfilePage() {
	return (
		<ProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN"]}>
			<AdminProfilePage />
		</ProtectedRoute>
	);
}

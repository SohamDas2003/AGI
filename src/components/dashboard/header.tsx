"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Plus, MessageSquare, LogOut, User } from "lucide-react";

interface HeaderProps {
	className?: string;
}

export default function Header({ className }: HeaderProps) {
	const { user, logout } = useAuth();
	const router = useRouter();

	const handleLogout = async () => {
		await logout();
		router.push("/login");
	};

	return (
		<header
			className={cn("bg-white border-b border-gray-200 px-6 py-4", className)}>
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">
						Academic Dashboard
					</h1>
					<p className="text-sm text-gray-600">
						Monitor student performance and institutional metrics
					</p>
				</div>

				<div className="flex items-center space-x-4">
					{/* User Info and Logout */}
					<div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
						<div className="flex items-center space-x-2">
							<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
								<User className="w-4 h-4 text-blue-600" />
							</div>
							<div className="text-sm">
								<p className="font-medium text-gray-900">
									{user?.name || "Admin"}
								</p>
								<p className="text-gray-600">{user?.role}</p>
							</div>
						</div>

						<button
							onClick={handleLogout}
							className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
							title="Logout">
							<LogOut className="w-5 h-5" />
						</button>
					</div>
				</div>
			</div>
		</header>
	);
}

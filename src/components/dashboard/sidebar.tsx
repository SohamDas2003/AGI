"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
	LayoutDashboard,
	Users,
	GraduationCap,
	FileText,
	Settings,
	Search,
	Target,
	TrendingUp,
} from "lucide-react";

interface SidebarProps {
	className?: string;
	userRole?: "SUPERADMIN" | "ADMIN" | "STUDENT";
}

// Navigation items for different roles
const getNavigationForRole = (
	role: "SUPERADMIN" | "ADMIN" | "STUDENT" = "ADMIN"
) => {
	switch (role) {
		case "SUPERADMIN":
			return [
				{
					name: "Dashboard",
					icon: LayoutDashboard,
					href: "/superadmin/dashboard",
				},
				{
					name: "Create Admin",
					icon: Settings,
					href: "/superadmin/create-admin",
				},
				{
					name: "Create Student",
					icon: Users,
					href: "/superadmin/create-student",
				},
				{
					name: "View Students",
					icon: Users,
					href: "/superadmin/students",
				},
			];
		case "ADMIN":
			return [
				{
					name: "Dashboard",
					icon: LayoutDashboard,
					href: "/admin/dashboard",
				},
				{
					name: "Students",
					icon: Users,
					href: "/admin/students",
				},
				{
					name: "Create Student",
					icon: Users,
					href: "/admin/create-student",
				},
				{
					name: "Assessments",
					icon: Target,
					href: "/admin/assessments",
				},
				{
					name: "Create Assessment",
					icon: FileText,
					href: "/admin/create-assessment",
				},
			];
		case "STUDENT":
			return [
				{
					name: "Dashboard",
					icon: LayoutDashboard,
					href: "/student/dashboard",
				},
				{
					name: "Assessments",
					icon: Target,
					href: "/student/assessments",
				},
			];
		default:
			return [
				{
					name: "Dashboard",
					icon: LayoutDashboard,
					href: "/dashboard",
				},
			];
	}
};

export default function Sidebar({
	className,
	userRole = "ADMIN",
}: SidebarProps) {
	const pathname = usePathname();
	const navigation = getNavigationForRole(userRole);

	// Function to check if the current path matches the navigation item
	const isCurrentPath = (href: string) => {
		// For exact dashboard paths, match exactly
		if (href.endsWith("/dashboard")) {
			return pathname === href;
		}
		// For other paths, check if current path starts with the href
		return pathname.startsWith(href);
	};

	return (
		<div
			className={cn(
				"flex h-full w-64 flex-col bg-white border-r border-gray-200",
				className
			)}>
			{/* Header */}
			<div className="flex h-16 items-center px-6 border-b border-gray-200">
				<div className="flex items-center space-x-3">
					<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
						<GraduationCap className="w-5 h-5 text-white" />
					</div>
					<div className="flex-1">
						<span className="text-lg font-semibold text-gray-900">
							AGI Portal
						</span>
						<p className="text-xs text-gray-500">Placement Assessment</p>
					</div>
				</div>
			</div>

			{/* Search */}
			<div className="px-6 py-4">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						placeholder="Search students, assessments..."
						className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
					/>
				</div>
			</div>

			{/* Navigation */}
			<nav className="flex-1 px-4 pb-4">
				<ul className="space-y-1">
					{navigation.map((item) => {
						const isCurrent = isCurrentPath(item.href);
						return (
							<li key={item.name}>
								<Link
									href={item.href}
									className={cn(
										"group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-[1.02]",
										isCurrent
											? "bg-blue-50 text-blue-700 border border-blue-200"
											: "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
									)}>
									<item.icon
										className={cn(
											"mr-3 h-5 w-5 transition-colors duration-200",
											isCurrent
												? "text-blue-500"
												: "text-gray-400 group-hover:text-gray-500"
										)}
									/>
									{item.name}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>

			{/* Quick Stats */}
			<div className="px-4 pb-4">
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
					<div className="flex items-center space-x-2 mb-2">
						<TrendingUp className="w-4 h-4 text-blue-600" />
						<span className="text-sm font-medium text-blue-900">
							Quick Stats
						</span>
					</div>
					<div className="space-y-1 text-xs text-blue-700">
						<div className="flex justify-between">
							<span>Active Students:</span>
							<span className="font-medium">1,247</span>
						</div>
						<div className="flex justify-between">
							<span>Completed Assessments:</span>
							<span className="font-medium">905</span>
						</div>
						<div className="flex justify-between">
							<span>Placement Rate:</span>
							<span className="font-medium">0%</span>
						</div>
					</div>
				</div>
			</div>

			{/* User Profile */}
			<div className="p-4 border-t border-gray-200">
				<div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
					<div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
						<span className="text-sm font-medium text-white">AD</span>
					</div>
					<div className="flex-1">
						<p className="text-sm font-medium text-gray-900">Admin User</p>
						<p className="text-xs text-gray-500">admin@agi.edu.in</p>
					</div>
				</div>
			</div>
		</div>
	);
}

"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
	LayoutDashboard,
	Users,
	GraduationCap,
	FileText,
	BarChart3,
	Settings,
	Search,
	Target,
	Upload,
	Award,
	TrendingUp,
	ClipboardList,
} from "lucide-react";

interface SidebarProps {
	className?: string;
}

const navigation = [
	{
		name: "Dashboard",
		icon: LayoutDashboard,
		href: "/dashboard",
		current: true,
	},
	{
		name: "Students",
		icon: Users,
		href: "/dashboard/students",
		current: false,
	},
	{
		name: "Bulk Upload",
		icon: Upload,
		href: "/dashboard/bulk-upload",
		current: false,
	},
	{
		name: "Assessments",
		icon: Target,
		href: "/dashboard/assessments",
		current: false,
	},
	{
		name: "Results",
		icon: ClipboardList,
		href: "/dashboard/results",
		current: false,
	},
	{
		name: "Analytics",
		icon: BarChart3,
		href: "/dashboard/analytics",
		current: false,
	},
	{
		name: "Reports",
		icon: FileText,
		href: "/dashboard/reports",
		current: false,
	},
	{
		name: "Placement",
		icon: Award,
		href: "/dashboard/placement",
		current: false,
	},
	{
		name: "Settings",
		icon: Settings,
		href: "/dashboard/settings",
		current: false,
	},
];

export default function Sidebar({ className }: SidebarProps) {
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
					{navigation.map((item) => (
						<li key={item.name}>
							<a
								href={item.href}
								className={cn(
									"group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-[1.02]",
									item.current
										? "bg-blue-50 text-blue-700 border border-blue-200"
										: "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
								)}>
								<item.icon
									className={cn(
										"mr-3 h-5 w-5 transition-colors duration-200",
										item.current
											? "text-blue-500"
											: "text-gray-400 group-hover:text-gray-500"
									)}
								/>
								{item.name}
							</a>
						</li>
					))}
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
							<span className="font-medium">72.8%</span>
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

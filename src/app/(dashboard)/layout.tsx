"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
	LayoutDashboard,
	UserPlus,
	LogOut,
	GraduationCap,
	User,
	Shield,
	FileText,
	Target,
	Users,
	Menu,
	X as Close,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";

interface User {
	email: string;
	role: "SUPERADMIN" | "ADMIN" | "STUDENT";
	firstName: string;
	lastName: string;
	userId: string;
}

interface NavigationItem {
	label: string;
	href: string;
	icon: React.ComponentType<{ size?: number; className?: string }>;
	roles: ("SUPERADMIN" | "ADMIN" | "STUDENT")[];
}

const navigationItems: NavigationItem[] = [
	// SUPERADMIN Navigation (only existing pages)
	{
		label: "Dashboard",
		href: "/superadmin/dashboard",
		icon: LayoutDashboard,
		roles: ["SUPERADMIN"],
	},
	{
		label: "Create Admin",
		href: "/superadmin/create-admin",
		icon: Shield,
		roles: ["SUPERADMIN"],
	},
	{
		label: "Create Student",
		href: "/superadmin/create-student",
		icon: UserPlus,
		roles: ["SUPERADMIN"],
	},
	{
		label: "View Students",
		href: "/superadmin/students",
		icon: Users,
		roles: ["SUPERADMIN"],
	},

	// ADMIN Navigation (only existing pages)
	{
		label: "Dashboard",
		href: "/admin/dashboard",
		icon: LayoutDashboard,
		roles: ["ADMIN"],
	},
	{
		label: "Create Student",
		href: "/admin/create-student",
		icon: UserPlus,
		roles: ["ADMIN"],
	},
	{
		label: "View Students",
		href: "/admin/students",
		icon: Users,
		roles: ["ADMIN"],
	},
	{
		label: "Create Assessment",
		href: "/admin/create-assessment",
		icon: FileText,
		roles: ["ADMIN"],
	},
	{
		label: "View Assessments",
		href: "/admin/assessments",
		icon: Target,
		roles: ["ADMIN"],
	},
	{
		label: "Profile",
		href: "/admin/profile",
		icon: User,
		roles: ["ADMIN"],
	},

	// STUDENT Navigation (only existing pages)
	{
		label: "Dashboard",
		href: "/student/dashboard",
		icon: LayoutDashboard,
		roles: ["STUDENT"],
	},
	{
		label: "Assessments",
		href: "/student/assessments",
		icon: Target,
		roles: ["STUDENT"],
	},
	{
		label: "Profile",
		href: "/student/profile",
		icon: User,
		roles: ["STUDENT"],
	},
];

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		// Check authentication
		const checkAuth = async () => {
			try {
				const response = await fetch("/api/auth/me");
				if (response.ok) {
					const data = await response.json();
					setUser(data.user);
				} else {
					router.push("/login");
				}
			} catch (error) {
				console.error("Auth check failed:", error);
				router.push("/login");
			} finally {
				setLoading(false);
			}
		};

		checkAuth();
	}, [router]);

	const handleLogout = async () => {
		try {
			await fetch("/api/auth/logout", { method: "POST" });
			router.push("/login");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-lg">Loading...</div>
			</div>
		);
	}

	if (!user) {
		return null;
	}

	// Filter navigation items based on user role
	const userNavigationItems = navigationItems.filter((item) =>
		item.roles.includes(user.role)
	);

	return (
		<div className="min-h-screen bg-gray-50 flex">
			{/* Mobile sidebar (off-canvas) */}
			<div
				className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg border-r border-gray-200 transition-transform duration-300 ease-in-out lg:hidden ${
					isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
				}`}
				aria-hidden={!isMobileSidebarOpen}
				role="dialog"
				aria-modal="true">
				{/* Sidebar content - mobile */}
				<div className="flex h-full flex-col">
					{/* Header */}
					<div className="flex h-16 items-center px-4 border-b border-gray-200 justify-between">
						<div className="flex items-center space-x-3">
							<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
								<GraduationCap className="w-5 h-5 text-white" />
							</div>
							<div className="flex-1">
								<span className="text-lg font-semibold text-gray-900">
									AGI Portal
								</span>
								<p className="text-xs text-gray-500">{user.role}</p>
							</div>
						</div>
						<button
							className="p-2 rounded-md hover:bg-gray-100"
							aria-label="Close sidebar"
							onClick={() => setIsMobileSidebarOpen(false)}>
							<Close className="h-5 w-5" />
						</button>
					</div>

					{/* Navigation */}
					<nav className="flex-1 px-4 pb-4 overflow-y-auto">
						<ul className="space-y-1 mt-4">
							{userNavigationItems.map((item, index) => {
								const isActive = pathname === item.href;
								return (
									<li key={index}>
										<Link
											href={item.href}
											onClick={() => setIsMobileSidebarOpen(false)}
											className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] ${
												isActive
													? "bg-blue-50 text-blue-700 border border-blue-200"
													: "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
											}`}>
											<item.icon
												className={`mr-3 h-5 w-5 transition-colors duration-200 ${
													isActive
														? "text-blue-500"
														: "text-gray-400 group-hover:text-gray-500"
												}`}
											/>
											{item.label}
										</Link>
									</li>
								);
							})}
						</ul>
					</nav>

					{/* User Profile and Logout */}
					<div className="mt-auto border-t border-gray-200">
						<div className="p-4">
							<div
								onClick={() => {
									if (user.role === "STUDENT") {
										router.push("/student/profile");
									} else if (user.role === "ADMIN") {
										router.push("/admin/profile");
									} else if (user.role === "SUPERADMIN") {
										router.push("/superadmin/profile");
									}
									setIsMobileSidebarOpen(false);
								}}
								className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
								<div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
									<span className="text-sm font-medium text-white">
										{user.firstName.charAt(0)}
										{user.lastName.charAt(0)}
									</span>
								</div>
								<div className="flex-1">
									<p className="text-sm font-medium text-gray-900">
										{user.firstName} {user.lastName}
									</p>
									<p className="text-xs text-gray-500">{user.email}</p>
								</div>
							</div>
						</div>
						<div className="px-4 pb-4">
							<button
								onClick={handleLogout}
								className="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 hover:cursor-pointer transition-colors">
								<LogOut
									size={20}
									className="mr-3"
								/>
								Logout
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Backdrop for mobile */}
			{isMobileSidebarOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/30 lg:hidden"
					onClick={() => setIsMobileSidebarOpen(false)}
					aria-hidden="true"
				/>
			)}

			{/* Desktop sidebar */}
			<div
				className={`${
					isSidebarCollapsed ? "w-20" : "w-64"
				} fixed inset-y-0 left-0 z-40 bg-white shadow-lg border-r border-gray-200 hidden lg:flex flex-col transition-[width] duration-300 h-screen`}>
				{/* Header */}
				<div className="flex h-16 items-center px-4 border-b border-gray-200 justify-between">
					<div className="flex items-center space-x-3">
						<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
							<GraduationCap className="w-5 h-5 text-white" />
						</div>
						{!isSidebarCollapsed && (
							<div className="flex-1">
								<span className="text-lg font-semibold text-gray-900">
									AGI Portal
								</span>
								<p className="text-xs text-gray-500">{user.role}</p>
							</div>
						)}
					</div>
					<button
						className="p-2 rounded-md hover:bg-gray-100"
						onClick={() => setIsSidebarCollapsed((v) => !v)}
						aria-label={
							isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
						}>
						{isSidebarCollapsed ? (
							<ChevronRight className="h-5 w-5" />
						) : (
							<ChevronLeft className="h-5 w-5" />
						)}
					</button>
				</div>

				{/* Navigation */}
				<nav className="flex-1 px-2 pb-4 overflow-y-auto">
					<ul className="space-y-1 mt-4">
						{userNavigationItems.map((item, index) => {
							const isActive = pathname === item.href;
							return (
								<li key={index}>
									<Link
										href={item.href}
										className={`group flex items-center ${
											isSidebarCollapsed ? "justify-center" : "px-3"
										} py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] ${
											isActive
												? "bg-blue-50 text-blue-700 border border-blue-200"
												: "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
										}`}>
										<item.icon
											className={`h-5 w-5 transition-colors duration-200 ${
												isActive
													? "text-blue-500"
													: "text-gray-400 group-hover:text-gray-500"
											} ${isSidebarCollapsed ? "" : "mr-3"}`}
										/>
										{!isSidebarCollapsed && item.label}
									</Link>
								</li>
							);
						})}
					</ul>
				</nav>

				{/* User Profile */}
				<div className="p-4 border-t border-gray-200">
					<div
						onClick={() => {
							if (user.role === "STUDENT") {
								router.push("/student/profile");
							} else if (user.role === "ADMIN") {
								router.push("/admin/profile");
							} else if (user.role === "SUPERADMIN") {
								router.push("/superadmin/profile");
							}
						}}
						className={`flex items-center ${
							isSidebarCollapsed ? "justify-center" : "space-x-3"
						} p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer`}>
						<div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
							<span className="text-sm font-medium text-white">
								{user.firstName.charAt(0)}
								{user.lastName.charAt(0)}
							</span>
						</div>
						{!isSidebarCollapsed && (
							<div className="flex-1">
								<p className="text-sm font-medium text-gray-900">
									{user.firstName} {user.lastName}
								</p>
								<p className="text-xs text-gray-500">{user.email}</p>
							</div>
						)}
					</div>
				</div>

				{/* Logout */}
				<div className="px-4 pb-4">
					<button
						onClick={handleLogout}
						className={`flex items-center w-full ${
							isSidebarCollapsed ? "justify-center" : "px-4"
						} py-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 hover:cursor-pointer transition-colors`}
						title="Logout">
						<LogOut
							size={20}
							className={`${isSidebarCollapsed ? "" : "mr-3"}`}
						/>
						{!isSidebarCollapsed && "Logout"}
					</button>
				</div>
			</div>

			{/* Main Content */}
			<div
				className={`flex-1 flex flex-col min-w-0 ${
					isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
				}`}>
				{/* Top bar */}
				<div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 lg:hidden">
					<button
						className="p-2 rounded-md hover:bg-gray-100"
						onClick={() => setIsMobileSidebarOpen(true)}
						aria-label="Open sidebar">
						<Menu className="h-5 w-5" />
					</button>
					<div>
						<h1 className="text-base font-semibold text-gray-900">Dashboard</h1>
						<p className="text-xs text-gray-600">{user.role}</p>
					</div>
				</div>

				{/* Page Content */}
				<main className="flex-1 p-4 lg:p-6">{children}</main>
			</div>
		</div>
	);
}

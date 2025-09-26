"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
];

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

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
			{/* Sidebar */}
			<div className="w-64 bg-white shadow-lg border-r border-gray-200">
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
							<p className="text-xs text-gray-500">{user.role}</p>
						</div>
					</div>
				</div>

				{/* Navigation */}
				<nav className="flex-1 px-4 pb-4">
					<ul className="space-y-1 mt-4">
						{userNavigationItems.map((item, index) => (
							<li key={index}>
								<Link
									href={item.href}
									className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] text-gray-700 hover:bg-gray-50 hover:text-gray-900">
									<item.icon className="mr-3 h-5 w-5 transition-colors duration-200 text-gray-400 group-hover:text-gray-500" />
									{item.label}
								</Link>
							</li>
						))}
					</ul>
				</nav>

				{/* User Profile */}
				<div className="p-4 border-t border-gray-200">
					<div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
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

				{/* Logout */}
				<div className="px-4 pb-4">
					<button
						onClick={handleLogout}
						className="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors">
						<LogOut
							size={20}
							className="mr-3"
						/>
						Logout
					</button>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 flex flex-col">
				{/* Top Header */}
				<header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">
								{user.role === "SUPERADMIN" && "Super Administrator Dashboard"}
								{user.role === "ADMIN" && "Administrator Dashboard"}
								{user.role === "STUDENT" && "Student Dashboard"}
							</h1>
						</div>
						<div className="flex items-center space-x-4">
							<span className="text-sm text-gray-600">
								Welcome, {user.firstName}!
							</span>
							<span className="text-xs text-blue-600 font-medium px-2 py-1 bg-blue-50 rounded-full">
								{user.role}
							</span>
						</div>
					</div>
				</header>

				{/* Page Content */}
				<main className="flex-1 p-6">{children}</main>
			</div>
		</div>
	);
}

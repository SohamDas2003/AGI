"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
	children: React.ReactNode;
	allowedRoles: ("SUPERADMIN" | "ADMIN" | "STUDENT")[];
	redirectTo?: string;
}

export default function ProtectedRoute({
	children,
	allowedRoles,
	redirectTo = "/unauthorized",
}: ProtectedRouteProps) {
	const { user, isLoading } = useAuth();
	const router = useRouter();
	const [isAuthorized, setIsAuthorized] = useState(false);

	useEffect(() => {
		if (isLoading) return;

		if (!user) {
			// Not authenticated, redirect to login
			router.push("/login");
			return;
		}

		if (!allowedRoles.includes(user.role)) {
			// Not authorized for this role, redirect to unauthorized
			router.push(redirectTo);
			return;
		}

		// User is authenticated and authorized
		setIsAuthorized(true);
	}, [user, isLoading, allowedRoles, redirectTo, router]);

	// Show loading spinner while checking auth
	if (isLoading || !isAuthorized) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Checking authorization...</p>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}

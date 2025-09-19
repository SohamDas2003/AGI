"use client";

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";

interface User {
	email: string;
	role: "SUPERADMIN" | "ADMIN" | "STUDENT";
	firstName?: string;
	lastName?: string;
	name?: string;
	studentId?: string;
}

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	login: (
		email: string,
		password: string,
		userType?: "SUPERADMIN" | "ADMIN" | "STUDENT"
	) => Promise<User | null>;
	logout: () => Promise<void>;
	checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const checkAuth = async () => {
		try {
			const response = await fetch("/api/auth/me", {
				method: "GET",
				credentials: "include",
			});

			if (response.ok) {
				const data = await response.json();
				if (data.success && data.user) {
					setUser(data.user);
				}
			}
		} catch (error) {
			console.error("Auth check failed:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const login = async (
		email: string,
		password: string,
		userType?: "SUPERADMIN" | "ADMIN" | "STUDENT"
	): Promise<User | null> => {
		try {
			// If userType is not provided, try to determine it by attempting login with different roles
			if (!userType) {
				// Try SUPERADMIN first, then ADMIN, then STUDENT
				const rolesToTry: ("SUPERADMIN" | "ADMIN" | "STUDENT")[] = [
					"SUPERADMIN",
					"ADMIN",
					"STUDENT",
				];

				for (const role of rolesToTry) {
					const response = await fetch("/api/auth/login", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						credentials: "include",
						body: JSON.stringify({ email, password, userType: role }),
					});

					const data = await response.json();

					if (data.success && data.user) {
						setUser(data.user);
						return data.user;
					}
				}
				return null;
			} else {
				// Use provided userType
				const response = await fetch("/api/auth/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({ email, password, userType }),
				});

				const data = await response.json();

				if (data.success && data.user) {
					setUser(data.user);
					return data.user;
				}

				return null;
			}
		} catch (error) {
			console.error("Login failed:", error);
			return null;
		}
	};

	const logout = async () => {
		try {
			await fetch("/api/auth/logout", {
				method: "POST",
				credentials: "include",
			});
		} catch (error) {
			console.error("Logout failed:", error);
		} finally {
			setUser(null);
		}
	};

	useEffect(() => {
		checkAuth();
	}, []);

	const value: AuthContextType = {
		user,
		isLoading,
		login,
		logout,
		checkAuth,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

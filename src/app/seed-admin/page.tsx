"use client";

import { useState } from "react";

export default function SeedAdminPage() {
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSeedAdmin = async () => {
		setIsLoading(true);
		setMessage("");

		try {
			const response = await fetch("/api/auth/seed-admin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});

			const data = await response.json();
			setMessage(JSON.stringify(data, null, 2));
		} catch (error) {
			setMessage(
				`Error: ${error instanceof Error ? error.message : "Unknown error"}`
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
			<div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
				<h1 className="text-2xl font-bold mb-6 text-center">Seed Admin User</h1>

				<button
					onClick={handleSeedAdmin}
					disabled={isLoading}
					className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50">
					{isLoading ? "Seeding..." : "Seed Admin User"}
				</button>

				{message && (
					<div className="mt-4 p-4 bg-gray-100 rounded-lg">
						<pre className="text-sm overflow-auto">{message}</pre>
					</div>
				)}
			</div>
		</div>
	);
}

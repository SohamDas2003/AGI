"use client";

import React from "react";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";

export default function StudentAnalytics() {
	return (
		<div className="flex h-screen bg-gray-50">
			<Sidebar />
			<div className="flex-1 flex flex-col overflow-hidden">
				<Header />
				<main className="flex-1 overflow-y-auto p-6">
					<div className="max-w-7xl mx-auto">
						<h1 className="text-3xl font-bold text-gray-900 mb-6">
							Student Analytics
						</h1>
						<div className="bg-white rounded-lg shadow p-6">
							<p className="text-gray-600">
								Your personal analytics and performance insights will be
								displayed here.
							</p>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}

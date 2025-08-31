"use client";

import React from "react";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import MetricsCards from "@/components/dashboard/metrics-cards";
import PerformanceChart from "@/components/dashboard/performance-chart";
import StudentTable from "@/components/dashboard/student-table";
import ClassOverview from "@/components/dashboard/class-overview";
import {
	dashboardMetrics,
	chartData,
	students,
	courseAnalytics,
	skillAnalytics,
} from "@/lib/mock-data";

export default function StudentDashboard() {
	return (
		<div className="flex h-screen bg-gray-50">
			{/* Sidebar */}
			<Sidebar />

			{/* Main Content */}
			<div className="flex-1 flex flex-col overflow-hidden">
				<Header />

				<main className="flex-1 overflow-y-auto p-6">
					<div className="max-w-7xl mx-auto space-y-6">
						{/* Page Header */}
						<div className="mb-8">
							<h1 className="text-3xl font-bold text-gray-900 mb-2">
								Student Dashboard
							</h1>
							<p className="text-gray-600">
								View your assessment performance and track your placement
								readiness progress
							</p>
						</div>

						{/* Metrics Cards */}
						<MetricsCards metrics={dashboardMetrics} />

						{/* Charts and Course Overview */}
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							<div className="lg:col-span-2">
								<PerformanceChart data={chartData} />
							</div>
							<div className="lg:col-span-1">
								<ClassOverview
									courses={courseAnalytics}
									skills={skillAnalytics}
								/>
							</div>
						</div>

						{/* Student Table - for students, this could show their personal progress */}
						<StudentTable students={students} />
					</div>
				</main>
			</div>
		</div>
	);
}

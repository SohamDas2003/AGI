"use client";

import React from "react";
import MetricsCards from "@/components/dashboard/metrics-cards";
import PerformanceChart from "@/components/dashboard/performance-chart";
import ClassOverview from "@/components/dashboard/class-overview";
import {
	dashboardMetrics,
	chartData,
	courseAnalytics,
	skillAnalytics,
} from "@/lib/mock-data";

export default function Dashboard() {
	return (
		<div className="max-w-7xl mx-auto space-y-6">
			{/* Page Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Placement Assessment Dashboard
				</h1>
				<p className="text-gray-600">
					Monitor student performance across 5 key skill areas and track
					placement readiness
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

			{/* Placeholder for Student Data */}
			<div className="bg-white p-6 rounded-lg shadow">
				<h2 className="text-xl font-semibold text-gray-900 mb-4">
					Student Overview
				</h2>
				<div className="text-center py-8">
					<p className="text-gray-500">
						Student data will be displayed here when integrated with the
						database.
					</p>
				</div>
			</div>
		</div>
	);
}

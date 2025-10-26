"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
	TrendingUp,
	TrendingDown,
	Users,
	Target,
	Award,
	CheckCircle,
	ClipboardList,
} from "lucide-react";
import { DashboardMetrics } from "@/types";

interface MetricsCardsProps {
	metrics: DashboardMetrics;
	className?: string;
}

interface MetricCardProps {
	title: string;
	value: string | number;
	change: number;
	description: string;
	icon: React.ElementType;
	delay?: number;
}

function MetricCard({
	title,
	value,
	change,
	description,
	icon: Icon,
	delay = 0,
}: MetricCardProps) {
	const isPositive = change >= 0;

	return (
		<div
			className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group"
			style={{ animationDelay: `${delay}ms` }}>
			<div className="flex items-center justify-between">
				<div className="flex-1 min-w-0">
					<p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
						{title}
					</p>
					<p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 truncate">
						{value}
					</p>
				</div>
				<div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-200 flex-shrink-0 ml-2">
					<Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
				</div>
			</div>

			<div className="mt-3 sm:mt-4 flex items-center gap-2">
				<div
					className={cn(
						"flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0",
						isPositive
							? "bg-green-100 text-green-800"
							: "bg-red-100 text-red-800"
					)}>
					{isPositive ? (
						<TrendingUp className="w-3 h-3" />
					) : (
						<TrendingDown className="w-3 h-3" />
					)}
					<span>{Math.abs(change)}%</span>
				</div>
				<p className="text-xs sm:text-sm text-gray-600 truncate">
					{description}
				</p>
			</div>
		</div>
	);
}

export default function MetricsCards({
	metrics,
	className,
}: MetricsCardsProps) {
	return (
		<div
			className={cn(
				"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6",
				className
			)}>
			<MetricCard
				title="Total Students"
				value={metrics.totalStudents.toLocaleString()}
				change={metrics.totalStudentsChange}
				description="Active enrollments"
				icon={Users}
				delay={0}
			/>
			<MetricCard
				title="Active Assessments"
				value={metrics.activeAssessments}
				change={metrics.activeAssessmentsChange}
				description="In progress"
				icon={Target}
				delay={100}
			/>
			<MetricCard
				title="Completed Assessments"
				value={metrics.completedAssessments.toLocaleString()}
				change={metrics.completedAssessmentsChange}
				description="Total completed"
				icon={ClipboardList}
				delay={200}
			/>
			<MetricCard
				title="Average Score"
				value={`${metrics.averageOverallScore}%`}
				change={metrics.averageOverallScoreChange}
				description="Overall performance"
				icon={Award}
				delay={300}
			/>
			<MetricCard
				title="Placement Rate"
				value={`${metrics.placementRecommendationRate}%`}
				change={metrics.placementRecommendationRateChange}
				description="Recommended for placement"
				icon={CheckCircle}
				delay={400}
			/>
		</div>
	);
}

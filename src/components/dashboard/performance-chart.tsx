"use client";

import React, { useState } from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import { ChartData } from "@/types";

interface PerformanceChartProps {
	data: ChartData[];
	className?: string;
}

const skillColors = {
	overallScore: "#3b82f6",
	domainSkills: "#f59e0b",
	communicationSkills: "#10b981",
	digitalSkills: "#8b5cf6",
	interpersonalSkills: "#ef4444",
	creativitySkills: "#06b6d4",
};

const skillLabels = {
	overallScore: "Overall Score",
	domainSkills: "Domain Skills",
	communicationSkills: "Communication",
	digitalSkills: "Digital Skills",
	interpersonalSkills: "Interpersonal",
	creativitySkills: "Creativity",
};

const timeRanges = [
	{ label: "Last 3 months", value: "3m" },
	{ label: "Last 6 months", value: "6m" },
	{ label: "Last year", value: "1y" },
];

export default function PerformanceChart({
	data,
	className,
}: PerformanceChartProps) {
	const [selectedRange, setSelectedRange] = useState("6m");
	const [visibleSkills, setVisibleSkills] = useState<Set<string>>(
		new Set(["overallScore", "domainSkills", "communicationSkills"])
	);

	const toggleSkill = (skill: string) => {
		const newVisibleSkills = new Set(visibleSkills);
		if (newVisibleSkills.has(skill)) {
			newVisibleSkills.delete(skill);
		} else {
			newVisibleSkills.add(skill);
		}
		setVisibleSkills(newVisibleSkills);
	};

	return (
		<div
			className={cn(
				"bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300",
				className
			)}>
			<div className="flex items-center justify-between mb-6">
				<div>
					<h3 className="text-lg font-semibold text-gray-900">
						Skill Performance Trends
					</h3>
					<p className="text-sm text-gray-600">
						Assessment performance across 5 core competencies
					</p>
				</div>
				<div className="flex space-x-2">
					{timeRanges.map((range) => (
						<button
							key={range.value}
							onClick={() => setSelectedRange(range.value)}
							className={cn(
								"px-3 py-1 text-sm font-medium rounded-lg transition-all duration-200",
								selectedRange === range.value
									? "bg-blue-100 text-blue-700 border border-blue-200"
									: "text-gray-600 hover:bg-gray-100"
							)}>
							{range.label}
						</button>
					))}
				</div>
			</div>

			{/* Skill Toggle Buttons */}
			<div className="mb-4 flex flex-wrap gap-2">
				{Object.entries(skillLabels).map(([skill, label]) => (
					<button
						key={skill}
						onClick={() => toggleSkill(skill)}
						className={cn(
							"px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 border",
							visibleSkills.has(skill)
								? "text-white border-transparent"
								: "text-gray-600 bg-gray-100 border-gray-200 hover:bg-gray-200"
						)}
						style={
							visibleSkills.has(skill)
								? {
										backgroundColor:
											skillColors[skill as keyof typeof skillColors],
										borderColor: skillColors[skill as keyof typeof skillColors],
								  }
								: {}
						}>
						{label}
					</button>
				))}
			</div>

			<div className="h-80">
				<ResponsiveContainer
					width="100%"
					height="100%">
					<LineChart
						data={data}
						margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
						<CartesianGrid
							strokeDasharray="3 3"
							stroke="#f0f0f0"
						/>
						<XAxis
							dataKey="date"
							stroke="#6b7280"
							fontSize={12}
							tickLine={false}
							axisLine={false}
						/>
						<YAxis
							stroke="#6b7280"
							fontSize={12}
							tickLine={false}
							axisLine={false}
							domain={[0, 100]}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: "white",
								border: "1px solid #e5e7eb",
								borderRadius: "8px",
								boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
							}}
							formatter={(value: number, name: string) => [
								`${value}%`,
								skillLabels[name as keyof typeof skillLabels] || name,
							]}
						/>
						<Legend
							formatter={(value) =>
								skillLabels[value as keyof typeof skillLabels] || value
							}
						/>

						{/* Render lines for visible skills */}
						{Object.entries(skillColors).map(
							([skill, color]) =>
								visibleSkills.has(skill) && (
									<Line
										key={skill}
										type="monotone"
										dataKey={skill}
										stroke={color}
										strokeWidth={skill === "overallScore" ? 3 : 2}
										dot={{
											fill: color,
											strokeWidth: 2,
											r: skill === "overallScore" ? 5 : 4,
										}}
										activeDot={{ r: 6, fill: color }}
										name={skill}
									/>
								)
						)}
					</LineChart>
				</ResponsiveContainer>
			</div>

			{/* Legend with current values */}
			<div className="mt-4 grid grid-cols-3 gap-4 text-sm">
				{Object.entries(skillLabels).map(([skill, label]) => {
					const latestValue = data[data.length - 1]?.[skill as keyof ChartData];
					return (
						<div
							key={skill}
							className="flex items-center space-x-2">
							<div
								className="w-3 h-3 rounded-full"
								style={{
									backgroundColor:
										skillColors[skill as keyof typeof skillColors],
								}}></div>
							<span className="text-gray-600">{label}:</span>
							<span className="font-semibold text-gray-900">
								{latestValue}%
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}

"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { CourseAnalytics, SkillAnalytics } from "@/types";
import { Users, TrendingUp, Award, Target, BarChart3 } from "lucide-react";

interface ClassOverviewProps {
	courses: CourseAnalytics[];
	skills: SkillAnalytics[];
	className?: string;
}

export default function ClassOverview({
	courses,
	skills,
	className,
}: ClassOverviewProps) {
	const [activeTab, setActiveTab] = useState<"courses" | "skills">("courses");

	return (
		<div
			className={cn(
				"bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300",
				className
			)}>
			<div className="flex items-center justify-between mb-6">
				<div>
					<h3 className="text-lg font-semibold text-gray-900">
						Performance Overview
					</h3>
					<p className="text-sm text-gray-600">
						Course performance and skill analytics
					</p>
				</div>
			</div>

			{/* Tab Switcher */}
			<div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
				<button
					onClick={() => setActiveTab("courses")}
					className={cn(
						"flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
						activeTab === "courses"
							? "bg-white text-blue-600 shadow-sm"
							: "text-gray-600 hover:text-gray-900"
					)}>
					Courses
				</button>
				<button
					onClick={() => setActiveTab("skills")}
					className={cn(
						"flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
						activeTab === "skills"
							? "bg-white text-blue-600 shadow-sm"
							: "text-gray-600 hover:text-gray-900"
					)}>
					Skills
				</button>
			</div>

			<div className="space-y-4">
				{activeTab === "courses" &&
					courses.map((course, index) => (
						<div
							key={course.course}
							className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-[1.01] group"
							style={{ animationDelay: `${index * 100}ms` }}>
							<div className="flex items-center justify-between mb-3">
								<h4 className="font-medium text-gray-900">{course.course}</h4>
								<span className="text-sm text-gray-500">
									{course.totalStudents} students
								</span>
							</div>

							<div className="grid grid-cols-3 gap-4">
								<div className="flex items-center space-x-2">
									<div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
										<Award className="w-4 h-4 text-blue-600" />
									</div>
									<div>
										<p className="text-xs text-gray-500">Avg Score</p>
										<p className="text-sm font-semibold text-gray-900">
											{course.averageScore.toFixed(1)}
										</p>
									</div>
								</div>

								<div className="flex items-center space-x-2">
									<div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
										<TrendingUp className="w-4 h-4 text-green-600" />
									</div>
									<div>
										<p className="text-xs text-gray-500">Placement</p>
										<p className="text-sm font-semibold text-gray-900">
											{course.placementRate.toFixed(1)}%
										</p>
									</div>
								</div>

								<div className="flex items-center space-x-2">
									<div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
										<Users className="w-4 h-4 text-purple-600" />
									</div>
									<div>
										<p className="text-xs text-gray-500">Top Perf.</p>
										<p className="text-sm font-semibold text-gray-900">
											{course.topPerformers}
										</p>
									</div>
								</div>
							</div>
						</div>
					))}

				{activeTab === "skills" &&
					skills.map((skill, index) => (
						<div
							key={skill.skill}
							className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-[1.01] group"
							style={{ animationDelay: `${index * 100}ms` }}>
							<div className="flex items-center justify-between mb-3">
								<h4 className="font-medium text-gray-900 text-sm">
									{skill.skill}
								</h4>
								<span className="text-sm text-gray-500">
									{skill.totalAssessments} assessments
								</span>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="flex items-center space-x-2">
									<div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
										<Target className="w-4 h-4 text-orange-600" />
									</div>
									<div>
										<p className="text-xs text-gray-500">Avg Score</p>
										<p className="text-sm font-semibold text-gray-900">
											{skill.averageScore.toFixed(1)}
										</p>
									</div>
								</div>

								<div className="flex items-center space-x-2">
									<div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
										<BarChart3 className="w-4 h-4 text-emerald-600" />
									</div>
									<div>
										<p className="text-xs text-gray-500">Trend</p>
										<p
											className={cn(
												"text-sm font-semibold",
												skill.improvementTrend > 0
													? "text-green-600"
													: "text-red-600"
											)}>
											{skill.improvementTrend > 0 ? "+" : ""}
											{skill.improvementTrend.toFixed(1)}%
										</p>
									</div>
								</div>
							</div>

							{/* Progress Bar */}
							<div className="mt-3">
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div
										className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
										style={{ width: `${skill.averageScore}%` }}></div>
								</div>
							</div>
						</div>
					))}
			</div>
		</div>
	);
}

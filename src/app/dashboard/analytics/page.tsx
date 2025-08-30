"use client";

import { useState } from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	LineChart,
	Line,
	PieChart,
	Pie,
	Cell,
	RadarChart,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
	Radar,
} from "recharts";
import {
	TrendingUp,
	TrendingDown,
	Users,
	Award,
	BarChart3,
	PieChart as PieChartIcon,
	Calendar,
	Download,
} from "lucide-react";

// Mock analytics data
const skillPerformanceData = [
	{
		skill: "Domain/Technical",
		averageScore: 82,
		totalStudents: 150,
		trend: 5.2,
	},
	{ skill: "Communication", averageScore: 76, totalStudents: 150, trend: -2.1 },
	{ skill: "Digital Skills", averageScore: 88, totalStudents: 150, trend: 8.7 },
	{ skill: "Interpersonal", averageScore: 79, totalStudents: 150, trend: 3.4 },
	{ skill: "Creativity", averageScore: 74, totalStudents: 150, trend: 1.8 },
];

const coursePerformanceData = [
	{
		course: "MBA",
		totalStudents: 45,
		averageScore: 81.2,
		placementRate: 87,
		topPerformers: 12,
	},
	{
		course: "MCA",
		totalStudents: 38,
		averageScore: 84.5,
		placementRate: 92,
		topPerformers: 15,
	},
	{
		course: "PGDM",
		totalStudents: 42,
		averageScore: 78.9,
		placementRate: 83,
		topPerformers: 10,
	},
	{
		course: "BMS",
		totalStudents: 25,
		averageScore: 75.6,
		placementRate: 76,
		topPerformers: 6,
	},
];

const monthlyTrendsData = [
	{ month: "Jan", assessments: 25, averageScore: 78.5, placements: 20 },
	{ month: "Feb", assessments: 42, averageScore: 81.2, placements: 35 },
	{ month: "Mar", assessments: 38, averageScore: 79.8, placements: 30 },
	{ month: "Apr", assessments: 45, averageScore: 82.4, placements: 38 },
	{ month: "May", assessments: 35, averageScore: 80.1, placements: 28 },
	{ month: "Jun", assessments: 48, averageScore: 83.7, placements: 42 },
];

const skillDistributionData = [
	{ name: "Excellent (80-100%)", value: 35, color: "#10B981" },
	{ name: "Good (70-79%)", value: 28, color: "#3B82F6" },
	{ name: "Average (60-69%)", value: 22, color: "#F59E0B" },
	{ name: "Below Average (<60%)", value: 15, color: "#EF4444" },
];

const radarData = [
	{ skill: "Domain", current: 82, target: 85 },
	{ skill: "Communication", current: 76, target: 80 },
	{ skill: "Digital", current: 88, target: 90 },
	{ skill: "Interpersonal", current: 79, target: 82 },
	{ skill: "Creativity", current: 74, target: 78 },
];

export default function AnalyticsPage() {
	const [selectedPeriod, setSelectedPeriod] = useState("6months");

	const totalAssessments = monthlyTrendsData.reduce(
		(sum, month) => sum + month.assessments,
		0
	);
	const totalPlacements = monthlyTrendsData.reduce(
		(sum, month) => sum + month.placements,
		0
	);
	const averageScore = 81.2;
	const placementRate = Math.round((totalPlacements / totalAssessments) * 100);

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">
						Analytics Dashboard
					</h1>
					<p className="text-gray-600">
						Comprehensive insights into student performance and placement trends
					</p>
				</div>
				<div className="flex items-center gap-3">
					<select
						value={selectedPeriod}
						onChange={(e) => setSelectedPeriod(e.target.value)}
						className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
						<option value="3months">Last 3 Months</option>
						<option value="6months">Last 6 Months</option>
						<option value="1year">Last Year</option>
					</select>
					<button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
						<Download className="w-4 h-4" />
						Export Report
					</button>
				</div>
			</div>

			{/* Key Metrics */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="bg-white p-6 rounded-lg border border-gray-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								Total Assessments
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{totalAssessments}
							</p>
							<div className="flex items-center gap-1 mt-1">
								<TrendingUp className="w-3 h-3 text-green-500" />
								<span className="text-xs text-green-600">+12.5%</span>
							</div>
						</div>
						<div className="p-3 bg-blue-100 rounded-lg">
							<BarChart3 className="w-6 h-6 text-blue-600" />
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-lg border border-gray-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">Average Score</p>
							<p className="text-2xl font-bold text-gray-900">
								{averageScore}%
							</p>
							<div className="flex items-center gap-1 mt-1">
								<TrendingUp className="w-3 h-3 text-green-500" />
								<span className="text-xs text-green-600">+3.2%</span>
							</div>
						</div>
						<div className="p-3 bg-green-100 rounded-lg">
							<Award className="w-6 h-6 text-green-600" />
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-lg border border-gray-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								Placement Rate
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{placementRate}%
							</p>
							<div className="flex items-center gap-1 mt-1">
								<TrendingUp className="w-3 h-3 text-green-500" />
								<span className="text-xs text-green-600">+5.8%</span>
							</div>
						</div>
						<div className="p-3 bg-purple-100 rounded-lg">
							<Users className="w-6 h-6 text-purple-600" />
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-lg border border-gray-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								Top Performers
							</p>
							<p className="text-2xl font-bold text-gray-900">43</p>
							<div className="flex items-center gap-1 mt-1">
								<TrendingDown className="w-3 h-3 text-red-500" />
								<span className="text-xs text-red-600">-1.2%</span>
							</div>
						</div>
						<div className="p-3 bg-orange-100 rounded-lg">
							<PieChartIcon className="w-6 h-6 text-orange-600" />
						</div>
					</div>
				</div>
			</div>

			{/* Charts Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Monthly Trends */}
				<div className="bg-white p-6 rounded-lg border border-gray-200">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-gray-900">
							Monthly Performance Trends
						</h3>
						<Calendar className="w-5 h-5 text-gray-400" />
					</div>
					<ResponsiveContainer
						width="100%"
						height={300}>
						<LineChart data={monthlyTrendsData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="month" />
							<YAxis />
							<Tooltip />
							<Line
								type="monotone"
								dataKey="averageScore"
								stroke="#3B82F6"
								strokeWidth={2}
								name="Average Score"
							/>
							<Line
								type="monotone"
								dataKey="assessments"
								stroke="#10B981"
								strokeWidth={2}
								name="Assessments"
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>

				{/* Skill Performance Radar */}
				<div className="bg-white p-6 rounded-lg border border-gray-200">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-gray-900">
							Skills Performance vs Target
						</h3>
						<BarChart3 className="w-5 h-5 text-gray-400" />
					</div>
					<ResponsiveContainer
						width="100%"
						height={300}>
						<RadarChart data={radarData}>
							<PolarGrid />
							<PolarAngleAxis dataKey="skill" />
							<PolarRadiusAxis domain={[0, 100]} />
							<Radar
								name="Current"
								dataKey="current"
								stroke="#3B82F6"
								fill="#3B82F6"
								fillOpacity={0.3}
							/>
							<Radar
								name="Target"
								dataKey="target"
								stroke="#10B981"
								fill="#10B981"
								fillOpacity={0.1}
							/>
							<Tooltip />
						</RadarChart>
					</ResponsiveContainer>
				</div>

				{/* Course Performance */}
				<div className="bg-white p-6 rounded-lg border border-gray-200">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-gray-900">
							Course-wise Performance
						</h3>
						<BarChart3 className="w-5 h-5 text-gray-400" />
					</div>
					<ResponsiveContainer
						width="100%"
						height={300}>
						<BarChart data={coursePerformanceData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="course" />
							<YAxis />
							<Tooltip />
							<Bar
								dataKey="averageScore"
								fill="#3B82F6"
								name="Average Score"
							/>
							<Bar
								dataKey="placementRate"
								fill="#10B981"
								name="Placement Rate"
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>

				{/* Performance Distribution */}
				<div className="bg-white p-6 rounded-lg border border-gray-200">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-gray-900">
							Performance Distribution
						</h3>
						<PieChartIcon className="w-5 h-5 text-gray-400" />
					</div>
					<ResponsiveContainer
						width="100%"
						height={300}>
						<PieChart>
							<Pie
								data={skillDistributionData}
								cx="50%"
								cy="50%"
								labelLine={false}
								label={({ value }) => `${value}%`}
								outerRadius={80}
								fill="#8884d8"
								dataKey="value">
								{skillDistributionData.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={entry.color}
									/>
								))}
							</Pie>
							<Tooltip />
						</PieChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Detailed Skill Analysis */}
			<div className="bg-white rounded-lg border border-gray-200">
				<div className="p-6 border-b border-gray-200">
					<h3 className="text-lg font-semibold text-gray-900">
						Detailed Skill Analysis
					</h3>
					<p className="text-gray-600">
						Performance breakdown by skill category
					</p>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Skill Category
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Average Score
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Students Assessed
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Trend
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Performance Band
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{skillPerformanceData.map((skill, index) => (
								<tr
									key={index}
									className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm font-medium text-gray-900">
											{skill.skill}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div className="text-sm font-medium text-gray-900">
												{skill.averageScore}%
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">
											{skill.totalStudents}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div
											className={`flex items-center gap-1 text-sm ${
												skill.trend >= 0 ? "text-green-600" : "text-red-600"
											}`}>
											{skill.trend >= 0 ? (
												<TrendingUp className="w-4 h-4" />
											) : (
												<TrendingDown className="w-4 h-4" />
											)}
											{skill.trend >= 0 ? "+" : ""}
											{skill.trend}%
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
												skill.averageScore >= 80
													? "bg-green-100 text-green-800"
													: skill.averageScore >= 70
													? "bg-yellow-100 text-yellow-800"
													: "bg-red-100 text-red-800"
											}`}>
											{skill.averageScore >= 80
												? "Excellent"
												: skill.averageScore >= 70
												? "Good"
												: "Needs Improvement"}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

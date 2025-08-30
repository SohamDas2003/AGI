"use client";

import { useState } from "react";
import {
	FileText,
	Download,
	Calendar,
	Filter,
	Users,
	BarChart3,
	PieChart,
	TrendingUp,
	Eye,
	Trash2,
} from "lucide-react";

interface Report {
	id: string;
	name: string;
	type:
		| "student_performance"
		| "skill_analysis"
		| "course_overview"
		| "placement_analytics";
	format: "pdf" | "excel" | "csv";
	createdAt: Date;
	status: "generating" | "ready" | "failed";
	size?: string;
	downloadCount: number;
	description: string;
}

const mockReports: Report[] = [
	{
		id: "1",
		name: "Q1 2024 Student Performance Report",
		type: "student_performance",
		format: "pdf",
		createdAt: new Date("2024-02-15"),
		status: "ready",
		size: "2.4 MB",
		downloadCount: 12,
		description:
			"Comprehensive analysis of student performance across all skill categories for Q1 2024",
	},
	{
		id: "2",
		name: "Skills Analysis - Technical Domain",
		type: "skill_analysis",
		format: "excel",
		createdAt: new Date("2024-02-10"),
		status: "ready",
		size: "1.8 MB",
		downloadCount: 8,
		description:
			"Detailed breakdown of technical and domain skill performance by course and division",
	},
	{
		id: "3",
		name: "Course-wise Overview January 2024",
		type: "course_overview",
		format: "pdf",
		createdAt: new Date("2024-02-08"),
		status: "ready",
		size: "3.1 MB",
		downloadCount: 15,
		description: "Monthly overview of performance metrics across all courses",
	},
	{
		id: "4",
		name: "Placement Analytics Dashboard",
		type: "placement_analytics",
		format: "csv",
		createdAt: new Date("2024-02-05"),
		status: "generating",
		downloadCount: 0,
		description:
			"Data export for placement recommendation analytics and trends",
	},
];

const reportTypes = [
	{
		id: "student_performance",
		name: "Student Performance",
		description: "Individual student assessment results and skill breakdowns",
		icon: Users,
		color: "bg-blue-100 text-blue-600",
	},
	{
		id: "skill_analysis",
		name: "Skill Analysis",
		description: "Detailed analysis of performance across skill categories",
		icon: BarChart3,
		color: "bg-green-100 text-green-600",
	},
	{
		id: "course_overview",
		name: "Course Overview",
		description: "Performance summary and analytics by course and division",
		icon: PieChart,
		color: "bg-purple-100 text-purple-600",
	},
	{
		id: "placement_analytics",
		name: "Placement Analytics",
		description: "Placement recommendation trends and success metrics",
		icon: TrendingUp,
		color: "bg-orange-100 text-orange-600",
	},
];

const getStatusColor = (status: Report["status"]) => {
	switch (status) {
		case "ready":
			return "bg-green-100 text-green-800 border-green-200";
		case "generating":
			return "bg-yellow-100 text-yellow-800 border-yellow-200";
		case "failed":
			return "bg-red-100 text-red-800 border-red-200";
		default:
			return "bg-gray-100 text-gray-800 border-gray-200";
	}
};

const getFormatIcon = (format: Report["format"]) => {
	switch (format) {
		case "pdf":
			return "📄";
		case "excel":
			return "📊";
		case "csv":
			return "📋";
		default:
			return "📄";
	}
};

export default function ReportsPage() {
	const [reports] = useState<Report[]>(mockReports);
	const [showNewReportModal, setShowNewReportModal] = useState(false);
	const [selectedReportType, setSelectedReportType] = useState("");
	const [selectedFormat, setSelectedFormat] = useState("pdf");
	const [reportName, setReportName] = useState("");
	const [dateRange, setDateRange] = useState({
		start: "",
		end: "",
	});

	const handleGenerateReport = () => {
		// Handle report generation logic here
		console.log("Generating report:", {
			type: selectedReportType,
			format: selectedFormat,
			name: reportName,
			dateRange,
		});
		setShowNewReportModal(false);
		// Reset form
		setSelectedReportType("");
		setSelectedFormat("pdf");
		setReportName("");
		setDateRange({ start: "", end: "" });
	};

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Reports</h1>
					<p className="text-gray-600">
						Generate and manage assessment and analytics reports
					</p>
				</div>
				<button
					onClick={() => setShowNewReportModal(true)}
					className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
					<FileText className="w-4 h-4" />
					Generate Report
				</button>
			</div>

			{/* Quick Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="bg-white p-6 rounded-lg border border-gray-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">Total Reports</p>
							<p className="text-2xl font-bold text-gray-900">
								{reports.length}
							</p>
						</div>
						<div className="p-3 bg-blue-100 rounded-lg">
							<FileText className="w-6 h-6 text-blue-600" />
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-lg border border-gray-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								Ready for Download
							</p>
							<p className="text-2xl font-bold text-green-600">
								{reports.filter((r) => r.status === "ready").length}
							</p>
						</div>
						<div className="p-3 bg-green-100 rounded-lg">
							<Download className="w-6 h-6 text-green-600" />
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-lg border border-gray-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								Total Downloads
							</p>
							<p className="text-2xl font-bold text-purple-600">
								{reports.reduce((sum, r) => sum + r.downloadCount, 0)}
							</p>
						</div>
						<div className="p-3 bg-purple-100 rounded-lg">
							<TrendingUp className="w-6 h-6 text-purple-600" />
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-lg border border-gray-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">Processing</p>
							<p className="text-2xl font-bold text-orange-600">
								{reports.filter((r) => r.status === "generating").length}
							</p>
						</div>
						<div className="p-3 bg-orange-100 rounded-lg">
							<Calendar className="w-6 h-6 text-orange-600" />
						</div>
					</div>
				</div>
			</div>

			{/* Report Types */}
			<div className="bg-white rounded-lg border border-gray-200 p-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Available Report Types
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{reportTypes.map((type) => {
						const IconComponent = type.icon;
						return (
							<div
								key={type.id}
								className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
								<div
									className={`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center mb-3`}>
									<IconComponent className="w-6 h-6" />
								</div>
								<h4 className="font-medium text-gray-900 mb-1">{type.name}</h4>
								<p className="text-sm text-gray-600">{type.description}</p>
							</div>
						);
					})}
				</div>
			</div>

			{/* Reports List */}
			<div className="bg-white rounded-lg border border-gray-200">
				<div className="p-6 border-b border-gray-200">
					<div className="flex justify-between items-center">
						<h3 className="text-lg font-semibold text-gray-900">
							Generated Reports
						</h3>
						<div className="flex items-center gap-2">
							<Filter className="w-4 h-4 text-gray-400" />
							<select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
								<option value="all">All Types</option>
								<option value="student_performance">Student Performance</option>
								<option value="skill_analysis">Skill Analysis</option>
								<option value="course_overview">Course Overview</option>
								<option value="placement_analytics">Placement Analytics</option>
							</select>
						</div>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Report
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Type
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Format
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Status
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Size
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Downloads
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Created
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{reports.map((report) => (
								<tr
									key={report.id}
									className="hover:bg-gray-50">
									<td className="px-6 py-4">
										<div>
											<div className="text-sm font-medium text-gray-900">
												{report.name}
											</div>
											<div className="text-sm text-gray-500">
												{report.description}
											</div>
										</div>
									</td>
									<td className="px-6 py-4">
										<span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
											{reportTypes.find((t) => t.id === report.type)?.name}
										</span>
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center gap-2">
											<span className="text-lg">
												{getFormatIcon(report.format)}
											</span>
											<span className="text-sm text-gray-900 uppercase">
												{report.format}
											</span>
										</div>
									</td>
									<td className="px-6 py-4">
										<span
											className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
												report.status
											)}`}>
											{report.status === "generating" && (
												<div className="w-2 h-2 bg-current rounded-full animate-pulse mr-1"></div>
											)}
											{report.status}
										</span>
									</td>
									<td className="px-6 py-4">
										<span className="text-sm text-gray-900">
											{report.size || "-"}
										</span>
									</td>
									<td className="px-6 py-4">
										<span className="text-sm text-gray-900">
											{report.downloadCount}
										</span>
									</td>
									<td className="px-6 py-4">
										<span className="text-sm text-gray-900">
											{report.createdAt.toLocaleDateString()}
										</span>
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center gap-2">
											{report.status === "ready" && (
												<>
													<button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
														<Eye className="w-4 h-4" />
													</button>
													<button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
														<Download className="w-4 h-4" />
													</button>
												</>
											)}
											<button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
												<Trash2 className="w-4 h-4" />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* New Report Modal */}
			{showNewReportModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-lg max-w-md w-full p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Generate New Report
						</h3>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Report Name
								</label>
								<input
									type="text"
									value={reportName}
									onChange={(e) => setReportName(e.target.value)}
									placeholder="Enter report name"
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Report Type
								</label>
								<select
									value={selectedReportType}
									onChange={(e) => setSelectedReportType(e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
									<option value="">Select report type</option>
									{reportTypes.map((type) => (
										<option
											key={type.id}
											value={type.id}>
											{type.name}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Format
								</label>
								<select
									value={selectedFormat}
									onChange={(e) => setSelectedFormat(e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
									<option value="pdf">PDF</option>
									<option value="excel">Excel</option>
									<option value="csv">CSV</option>
								</select>
							</div>

							<div className="grid grid-cols-2 gap-3">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Start Date
									</label>
									<input
										type="date"
										value={dateRange.start}
										onChange={(e) =>
											setDateRange({ ...dateRange, start: e.target.value })
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										End Date
									</label>
									<input
										type="date"
										value={dateRange.end}
										onChange={(e) =>
											setDateRange({ ...dateRange, end: e.target.value })
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</div>
							</div>
						</div>

						<div className="flex justify-end gap-3 mt-6">
							<button
								onClick={() => setShowNewReportModal(false)}
								className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
								Cancel
							</button>
							<button
								onClick={handleGenerateReport}
								disabled={!selectedReportType || !reportName}
								className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
								Generate Report
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

"use client";

import { useState } from "react";
import {
	Search,
	Filter,
	Building,
	MapPin,
	Calendar,
	Users,
	DollarSign,
	TrendingUp,
	Eye,
	Plus,
	CheckCircle,
	Clock,
	XCircle,
} from "lucide-react";

interface PlacementOpportunity {
	id: string;
	companyName: string;
	jobTitle: string;
	location: string;
	jobType: "full-time" | "internship" | "part-time";
	salary: {
		min: number;
		max: number;
		currency: string;
	};
	requiredSkills: string[];
	applicationDeadline: Date;
	postedDate: Date;
	status: "open" | "closed" | "draft";
	applicants: number;
	selected: number;
	description: string;
	companyLogo?: string;
}

interface PlacementRecord {
	id: string;
	studentName: string;
	rollNumber: string;
	course: string;
	companyName: string;
	jobTitle: string;
	salary: number;
	placementDate: Date;
	status: "placed" | "pending" | "rejected";
}

const mockOpportunities: PlacementOpportunity[] = [
	{
		id: "1",
		companyName: "TechCorp Solutions",
		jobTitle: "Software Developer",
		location: "Mumbai, India",
		jobType: "full-time",
		salary: { min: 400000, max: 600000, currency: "INR" },
		requiredSkills: ["JavaScript", "React", "Node.js", "Communication"],
		applicationDeadline: new Date("2024-03-15"),
		postedDate: new Date("2024-02-01"),
		status: "open",
		applicants: 25,
		selected: 3,
		description:
			"Looking for talented software developers to join our growing team.",
	},
	{
		id: "2",
		companyName: "DataTech Analytics",
		jobTitle: "Data Analyst Intern",
		location: "Bangalore, India",
		jobType: "internship",
		salary: { min: 15000, max: 20000, currency: "INR" },
		requiredSkills: ["Python", "SQL", "Data Analysis", "Communication"],
		applicationDeadline: new Date("2024-03-10"),
		postedDate: new Date("2024-01-25"),
		status: "open",
		applicants: 42,
		selected: 8,
		description: "Six-month internship program for aspiring data analysts.",
	},
	{
		id: "3",
		companyName: "Innovation Hub",
		jobTitle: "Business Analyst",
		location: "Pune, India",
		jobType: "full-time",
		salary: { min: 350000, max: 500000, currency: "INR" },
		requiredSkills: ["Business Analysis", "Communication", "Problem Solving"],
		applicationDeadline: new Date("2024-02-28"),
		postedDate: new Date("2024-01-20"),
		status: "closed",
		applicants: 18,
		selected: 2,
		description:
			"Join our team to drive business growth through data-driven insights.",
	},
];

const mockPlacements: PlacementRecord[] = [
	{
		id: "1",
		studentName: "Priya Sharma",
		rollNumber: "21MBA001",
		course: "MBA",
		companyName: "TechCorp Solutions",
		jobTitle: "Business Analyst",
		salary: 450000,
		placementDate: new Date("2024-01-15"),
		status: "placed",
	},
	{
		id: "2",
		studentName: "Rahul Patel",
		rollNumber: "21MCA002",
		course: "MCA",
		companyName: "DataTech Analytics",
		jobTitle: "Software Developer",
		salary: 380000,
		placementDate: new Date("2024-01-20"),
		status: "placed",
	},
	{
		id: "3",
		studentName: "Sneha Gupta",
		rollNumber: "21PGDM003",
		course: "PGDM",
		companyName: "Innovation Hub",
		jobTitle: "Marketing Executive",
		salary: 320000,
		placementDate: new Date("2024-02-01"),
		status: "pending",
	},
];

const getStatusColor = (status: string) => {
	switch (status) {
		case "open":
		case "placed":
			return "bg-green-100 text-green-800 border-green-200";
		case "closed":
		case "pending":
			return "bg-yellow-100 text-yellow-800 border-yellow-200";
		case "draft":
		case "rejected":
			return "bg-red-100 text-red-800 border-red-200";
		default:
			return "bg-gray-100 text-gray-800 border-gray-200";
	}
};

const getStatusIcon = (status: string) => {
	switch (status) {
		case "open":
		case "placed":
			return <CheckCircle className="w-4 h-4" />;
		case "closed":
		case "pending":
			return <Clock className="w-4 h-4" />;
		case "draft":
		case "rejected":
			return <XCircle className="w-4 h-4" />;
		default:
			return <Clock className="w-4 h-4" />;
	}
};

export default function PlacementPage() {
	const [activeTab, setActiveTab] = useState<"opportunities" | "placements">(
		"opportunities"
	);
	const [opportunities] = useState<PlacementOpportunity[]>(mockOpportunities);
	const [placements] = useState<PlacementRecord[]>(mockPlacements);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");

	const filteredOpportunities = opportunities.filter((opp) => {
		const matchesSearch =
			opp.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			opp.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus = statusFilter === "all" || opp.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	const filteredPlacements = placements.filter((placement) => {
		const matchesSearch =
			placement.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			placement.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			placement.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus =
			statusFilter === "all" || placement.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	const totalOpportunities = opportunities.length;
	const openOpportunities = opportunities.filter(
		(o) => o.status === "open"
	).length;
	const totalApplications = opportunities.reduce(
		(sum, o) => sum + o.applicants,
		0
	);
	const totalPlacements = placements.filter(
		(p) => p.status === "placed"
	).length;

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">
						Placement Management
					</h1>
					<p className="text-gray-600">
						Manage job opportunities and track student placements
					</p>
				</div>
				<button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
					<Plus className="w-4 h-4" />
					Add Opportunity
				</button>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="bg-white p-6 rounded-lg border border-gray-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								Total Opportunities
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{totalOpportunities}
							</p>
						</div>
						<div className="p-3 bg-blue-100 rounded-lg">
							<Building className="w-6 h-6 text-blue-600" />
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-lg border border-gray-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								Open Positions
							</p>
							<p className="text-2xl font-bold text-green-600">
								{openOpportunities}
							</p>
						</div>
						<div className="p-3 bg-green-100 rounded-lg">
							<CheckCircle className="w-6 h-6 text-green-600" />
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-lg border border-gray-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								Total Applications
							</p>
							<p className="text-2xl font-bold text-purple-600">
								{totalApplications}
							</p>
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
								Students Placed
							</p>
							<p className="text-2xl font-bold text-orange-600">
								{totalPlacements}
							</p>
						</div>
						<div className="p-3 bg-orange-100 rounded-lg">
							<TrendingUp className="w-6 h-6 text-orange-600" />
						</div>
					</div>
				</div>
			</div>

			{/* Tabs */}
			<div className="bg-white rounded-lg border border-gray-200">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						<button
							onClick={() => setActiveTab("opportunities")}
							className={`py-4 text-sm font-medium border-b-2 transition-colors ${
								activeTab === "opportunities"
									? "border-blue-500 text-blue-600"
									: "border-transparent text-gray-500 hover:text-gray-700"
							}`}>
							Job Opportunities
						</button>
						<button
							onClick={() => setActiveTab("placements")}
							className={`py-4 text-sm font-medium border-b-2 transition-colors ${
								activeTab === "placements"
									? "border-blue-500 text-blue-600"
									: "border-transparent text-gray-500 hover:text-gray-700"
							}`}>
							Placement Records
						</button>
					</nav>
				</div>

				{/* Filters */}
				<div className="p-4 border-b border-gray-200">
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
							<input
								type="text"
								placeholder={
									activeTab === "opportunities"
										? "Search companies or job titles..."
										: "Search students or companies..."
								}
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
						<div className="flex items-center gap-2">
							<Filter className="w-4 h-4 text-gray-400" />
							<select
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
								className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
								<option value="all">All Status</option>
								{activeTab === "opportunities" ? (
									<>
										<option value="open">Open</option>
										<option value="closed">Closed</option>
										<option value="draft">Draft</option>
									</>
								) : (
									<>
										<option value="placed">Placed</option>
										<option value="pending">Pending</option>
										<option value="rejected">Rejected</option>
									</>
								)}
							</select>
						</div>
					</div>
				</div>

				{/* Content */}
				{activeTab === "opportunities" ? (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Company & Position
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Location & Type
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Salary Range
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Applications
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Deadline
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Status
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredOpportunities.map((opportunity) => (
									<tr
										key={opportunity.id}
										className="hover:bg-gray-50">
										<td className="px-6 py-4">
											<div className="flex items-center">
												<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
													<Building className="w-5 h-5 text-blue-600" />
												</div>
												<div>
													<div className="text-sm font-medium text-gray-900">
														{opportunity.companyName}
													</div>
													<div className="text-sm text-gray-500">
														{opportunity.jobTitle}
													</div>
												</div>
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center gap-1 text-sm text-gray-900">
												<MapPin className="w-3 h-3" />
												{opportunity.location}
											</div>
											<div className="text-xs text-gray-500 capitalize">
												{opportunity.jobType}
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center gap-1 text-sm text-gray-900">
												<DollarSign className="w-3 h-3" />₹
												{(opportunity.salary.min / 100000).toFixed(1)}L - ₹
												{(opportunity.salary.max / 100000).toFixed(1)}L
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="text-sm text-gray-900">
												{opportunity.applicants} applied
											</div>
											<div className="text-xs text-gray-500">
												{opportunity.selected} selected
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center gap-1 text-sm text-gray-900">
												<Calendar className="w-3 h-3" />
												{opportunity.applicationDeadline.toLocaleDateString()}
											</div>
										</td>
										<td className="px-6 py-4">
											<span
												className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
													opportunity.status
												)}`}>
												{getStatusIcon(opportunity.status)}
												{opportunity.status}
											</span>
										</td>
										<td className="px-6 py-4">
											<button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
												<Eye className="w-4 h-4" />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Student
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Company
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Position
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Salary
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Placement Date
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Status
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredPlacements.map((placement) => (
									<tr
										key={placement.id}
										className="hover:bg-gray-50">
										<td className="px-6 py-4">
											<div>
												<div className="text-sm font-medium text-gray-900">
													{placement.studentName}
												</div>
												<div className="text-sm text-gray-500">
													{placement.rollNumber} • {placement.course}
												</div>
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="text-sm text-gray-900">
												{placement.companyName}
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="text-sm text-gray-900">
												{placement.jobTitle}
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center gap-1 text-sm text-gray-900">
												<DollarSign className="w-3 h-3" />₹
												{(placement.salary / 100000).toFixed(1)}L
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="text-sm text-gray-900">
												{placement.placementDate.toLocaleDateString()}
											</div>
										</td>
										<td className="px-6 py-4">
											<span
												className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
													placement.status
												)}`}>
												{getStatusIcon(placement.status)}
												{placement.status}
											</span>
										</td>
										<td className="px-6 py-4">
											<button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
												<Eye className="w-4 h-4" />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{(activeTab === "opportunities"
					? filteredOpportunities
					: filteredPlacements
				).length === 0 && (
					<div className="text-center py-12">
						<Building className="mx-auto h-12 w-12 text-gray-400" />
						<h3 className="mt-2 text-sm font-medium text-gray-900">
							No {activeTab} found
						</h3>
						<p className="mt-1 text-sm text-gray-500">
							{searchTerm || statusFilter !== "all"
								? "Try adjusting your search or filter criteria."
								: `No ${activeTab} available yet.`}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

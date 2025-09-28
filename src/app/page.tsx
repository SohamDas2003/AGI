"use client";

import React from "react";
import { useRouter } from "next/navigation";
import TextType from "../components/ui/text-type";
import {
	GraduationCap,
	Users,
	BarChart3,
	Target,
	Sparkles,
	MessageCircle,
	Monitor,
	Users2,
	Lightbulb,
	ChevronRight,
	Star,
	Award,
	TrendingUp,
	Shield,
	CheckCircle,
	ArrowRight,
	Mail,
	Phone,
	MapPin,
	Building2,
} from "lucide-react";

const PlacementStats: React.FC = () => {
	const placementData = [
		{
			title: "Overall Placement Rate",
			percentage: 92,
			value: "92%",
			icon: <Target className="w-8 h-8" />,
			color: "from-green-500 to-emerald-600",
			description: "Students successfully placed",
		},
		{
			title: "Average Salary Package",
			percentage: 75,
			value: "₹6.8L",
			icon: <TrendingUp className="w-8 h-8" />,
			color: "from-blue-500 to-indigo-600",
			description: "Per annum (CTC)",
		},
		{
			title: "Top Companies",
			percentage: 85,
			value: "150+",
			icon: <Building2 className="w-8 h-8" />,
			color: "from-purple-500 to-violet-600",
			description: "Recruiting partners",
		},
		{
			title: "Students Trained",
			percentage: 90,
			value: "2500+",
			icon: <Users className="w-8 h-8" />,
			color: "from-orange-500 to-red-600",
			description: "This academic year",
		},
	];
	const topRecruiters = [
		"Microsoft",
		"Google",
		"Amazon",
		"TCS",
		"Infosys",
		"Wipro",
		"Accenture",
		"IBM",
		"Cognizant",
		"HCL",
		"L&T Infotech",
		"Capgemini",
	];
	const departmentWise = [
		{ dept: "MCA", placed: 57, total: 60, percentage: 95 },
		{ dept: "MMS", placed: 110, total: 120, percentage: 92 },
		{ dept: "PGDM", placed: 81, total: 90, percentage: 90 },
		{ dept: "BMS", placed: 51, total: 60, percentage: 85 },
	];
	return (
		<section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className="text-center mb-16">
					<div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
						<Award className="w-4 h-4" />
						<span>Placement Excellence</span>
					</div>
					<h2 className="text-4xl font-bold text-gray-900 mb-4">
						Outstanding Placement Records
					</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						Our commitment to excellence reflects in our exceptional placement
						statistics and industry partnerships
					</p>
				</div>
				{/* Key Metrics Grid */}
				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
					{placementData.map((stat, index) => (
						<div
							key={index}
							className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
							<div
								className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white mb-4`}>
								{stat.icon}
							</div>
							<h3 className="text-2xl font-bold text-gray-900 mb-1">
								{stat.value}
							</h3>
							<p className="text-lg font-semibold text-gray-700 mb-1">
								{stat.title}
							</p>
							<p className="text-sm text-gray-500 mb-3">{stat.description}</p>
							{/* Progress Bar */}
							<div className="w-full bg-gray-200 rounded-full h-2">
								<div
									className={`h-2 rounded-full bg-gradient-to-r ${stat.color} transition-all duration-1000 ease-out`}
									style={{ width: `${stat.percentage}%` }}></div>
							</div>
						</div>
					))}
				</div>
				{/* Department-wise Placement and Top Recruiters */}
				<div className="grid lg:grid-cols-2 gap-12 mb-16">
					{/* Department-wise Placement */}
					<div className="bg-white rounded-2xl p-8 shadow-lg">
						<h3 className="text-2xl font-bold text-gray-900 mb-6">
							Department-wise Placement
						</h3>
						<div className="space-y-10">
							{departmentWise.map((dept, index) => (
								<div
									key={index}
									className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
									<div className="flex-1">
										<div className="flex items-center justify-between mb-2">
											<span className="font-semibold text-gray-900">
												{dept.dept}
											</span>
											<span className="text-sm text-gray-600">
												{dept.placed}/{dept.total}
											</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-3">
											<div
												className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-1000"
												style={{ width: `${dept.percentage}%` }}></div>
										</div>
									</div>
									<div className="ml-4 text-right">
										<span className="text-lg font-bold text-blue-600">
											{dept.percentage}%
										</span>
									</div>
								</div>
							))}
						</div>
					</div>
					{/* Top Recruiting Companies */}
					<div className="bg-white rounded-2xl p-8 shadow-lg">
						<h3 className="text-2xl font-bold text-gray-900 mb-6">
							Top Recruiting Companies
						</h3>
						<div className="grid grid-cols-2 gap-4">
							{topRecruiters.map((company, index) => (
								<div
									key={index}
									className="flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors group">
									<span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
										{company}
									</span>
								</div>
							))}
						</div>
						<div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
							<p className="text-sm text-blue-800 font-medium text-center">
								And many more leading companies across various industries
							</p>
						</div>
					</div>
				</div>
				{/* Placement Trends */}
				<div className="bg-white rounded-2xl p-8 shadow-lg">
					<h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
						Placement Trends (Last 5 Years)
					</h3>
					<div className="grid grid-cols-5 gap-4">
						{[2021, 2022, 2023, 2024, 2025].map((year, index) => {
							const percentage = 75 + index * 4; // Increasing trend
							return (
								<div
									key={year}
									className="text-center">
									<div className="relative mb-4">
										<div className="w-16 h-32 bg-gray-200 rounded-lg mx-auto overflow-hidden flex flex-col justify-end">
											<div
												className="bg-gradient-to-t from-blue-600 to-indigo-500 w-full rounded-lg transition-all duration-1000 ease-out"
												style={{ height: `${percentage}%` }}></div>
										</div>
										<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 text-sm font-bold text-blue-600">
											{percentage}%
										</div>
									</div>
									<p className="text-sm font-semibold text-gray-700">{year}</p>
								</div>
							);
						})}
					</div>
					<p className="text-center text-gray-600 mt-6">
						Consistent improvement in placement rates over the years
					</p>
				</div>
			</div>
		</section>
	);
};

export default function HomePage() {
	const router = useRouter();

	const skills = [
		{
			icon: <Target className="w-6 h-6" />,
			title: "Domain/Technical Skills",
			description:
				"Subject-specific knowledge and technical proficiency in chosen field",
		},
		{
			icon: <MessageCircle className="w-6 h-6" />,
			title: "Communication Skills",
			description: "Verbal, written communication and presentation abilities",
		},
		{
			icon: <Monitor className="w-6 h-6" />,
			title: "Digital Skills",
			description:
				"Computer literacy, software proficiency and technology adaptation",
		},
		{
			icon: <Users2 className="w-6 h-6" />,
			title: "Interpersonal Skills",
			description:
				"Teamwork, leadership, conflict resolution and emotional intelligence",
		},
		{
			icon: <Lightbulb className="w-6 h-6" />,
			title: "Creativity",
			description:
				"Innovation, problem-solving and creative thinking abilities",
		},
	];

	const programs = ["MBA", "MCA", "PGDM"];

	const features = [
		{
			icon: <Users className="w-8 h-8" />,
			title: "Bulk Student Registration",
			description:
				"Excel file upload for automatic profile creation and batch processing",
		},
		{
			icon: <BarChart3 className="w-8 h-8" />,
			title: "Comprehensive Analytics",
			description:
				"Real-time performance metrics, placement analytics and detailed reporting",
		},
		{
			icon: <Target className="w-8 h-8" />,
			title: "Skill-Based Assessment",
			description:
				"Evaluate students across 5 core competencies with detailed feedback",
		},
		{
			icon: <Award className="w-8 h-8" />,
			title: "Placement Recommendations",
			description:
				"AI-driven placement suggestions based on comprehensive skill evaluation",
		},
	];

	// const institutionImages = [
	//   "https://www.aimsr.edu.in/wp-content/uploads/al_opt_content/IMAGE/www.aimsr.edu.in/wp-content/uploads/2024/08/slider-1694260520.jpg?bv_host=www.aimsr.edu.in",
	//   "https://www.aimsr.edu.in/wp-content/uploads/al_opt_content/IMAGE/www.aimsr.edu.in/wp-content/uploads/2025/07/slider-banner.jpg?bv_host=www.aimsr.edu.in",
	//   "https://aimsr.edu.in/mca-admissions/assets/images/banner.jpg",
	//   "https://www.aimsr.edu.in/wp-content/uploads/al_opt_content/IMAGE/www.aimsr.edu.in/wp-content/uploads/2025/07/Life-At-Aimsr.jpg?bv_host=www.aimsr.edu.in",
	//   "https://www.aimsr.edu.in/wp-content/uploads/al_opt_content/IMAGE/www.aimsr.edu.in/wp-content/uploads/2025/07/Life-At-Aimsr-2.jpg?bv_host=www.aimsr.edu.in",
	// ];

	// // Carousel state example (if needed)
	// const [currentIndex, setCurrentIndex] = useState(0);
	// const goToPrevious = () => setCurrentIndex((prev) => (prev - 1 + institutionImages.length) % institutionImages.length);
	// const goToNext = () => setCurrentIndex((prev) => (prev + 1) % institutionImages.length);
	// const goToSlide = (index: number) => setCurrentIndex(index);

	const stats = [
		{
			number: "8",
			label: "Academic Programs",
			icon: <GraduationCap className="w-6 h-6" />,
		},
		{
			number: "5",
			label: "Core Skills Assessed",
			icon: <Target className="w-6 h-6" />,
		},
		{
			number: "1000+",
			label: "Students per Upload",
			icon: <Users className="w-6 h-6" />,
		},
		{
			number: "100%",
			label: "Placement Analytics",
			icon: <TrendingUp className="w-6 h-6" />,
		},
	];

	const testimonials = [
		{
			name: "Dr. Priya Sharma",
			role: "Academic Director",
			content:
				"This platform has revolutionized our placement process. The comprehensive skill assessment helps us better prepare our students for industry requirements.",
			rating: 5,
		},
		{
			name: "Rajesh Kumar",
			role: "Placement Officer",
			content:
				"The analytics and reporting features provide incredible insights into student performance. It's made our job so much easier and more effective.",
			rating: 5,
		},
		{
			name: "Anita Desai",
			role: "Department Head",
			content:
				"The bulk upload feature saves us hours of manual work. The platform is intuitive and the results are comprehensive and actionable.",
			rating: 5,
		},
	];

	return (
		<div className="min-h-screen bg-white">
			{/* Navigation Header */}
			<header className="bg-white shadow-sm border-b border-gray-100">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
								<GraduationCap className="w-6 h-6 text-white" />
							</div>
							<div>
								<h1 className="text-xl font-bold text-gray-900">
									Aditya Group Of Institutions
								</h1>
								<p className="text-xs text-gray-500">
									Student Assessment Platform
								</p>
							</div>
						</div>
						<nav className="hidden md:flex items-center space-x-8">
							{/* <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a> */}
							<a
								href="#features"
								className="text-gray-600 hover:text-blue-600 transition-colors">
								Features
							</a>
							<a
								href="#programs"
								className="text-gray-600 hover:text-blue-600 transition-colors">
								Programs
							</a>
							<a
								href="#contact"
								className="text-gray-600 hover:text-blue-600 transition-colors">
								Contact
							</a>
						</nav>
						<button
							onClick={() => router.push("/login")}
							className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
							Login
						</button>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section
				id="about"
				className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex flex-col gap-20 items-center">
						<div className="space-y-8 w-full">
							<div className="space-y-4">
								<div className="w-full flex justify-center pl-12 md:px-0">
									<TextType
										text={["Assess.", "Improve.", "Succeed."]}
										typingSpeed={75}
										pauseDuration={1500}
										showCursor={true}
										cursorCharacter="|"
										className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"
									/>
								</div>
								<h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight text-center mt-10">
									Self-Assessment Platform for the
									<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
										{" "}
										Aditya Group of Institutions
									</span>
								</h1>
								<p className="text-lg sm:text-xl text-gray-600 leading-relaxed text-center mx-auto mt-10">
									Empower your Assessment journey with instant skill insights
									across key areas — logical reasoning, tech knowledge,
									communication & more. Track progress, get personalized
									feedback, and shine confidently!
								</p>
							</div>

							<div className="flex flex-col sm:flex-row gap-4 justify-center mb-20 mt-20">
								<button
									onClick={() => router.push("/login")}
									className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group">
									Get Started
									<ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
								</button>
								<button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors">
									Learn More
								</button>
							</div>

							<div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
								{stats.map((stat, index) => (
									<div
										key={index}
										className="text-center">
										<div className="flex justify-center mb-2 text-blue-600">
											{stat.icon}
										</div>
										<div className="text-2xl font-bold text-gray-900">
											{stat.number}
										</div>
										<div className="text-sm text-gray-600">{stat.label}</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Image Carousel Section: Uncomment and add your carousel component here if available */}
				{/* <ImageCarousel images={institutionImages} /> */}
			</section>

			{/* Features Section */}
			<section
				id="features"
				className="py-15 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-gray-900 mb-4">
							Platform Features
						</h2>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
							Comprehensive tools for student assessment, management, and
							placement analytics
						</p>
					</div>
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{features.map((feature, index) => (
							<div
								key={index}
								className="group">
								<div className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
									<div className="text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">
										{feature.icon}
									</div>
									<h3 className="text-xl font-semibold text-gray-900 mb-3">
										{feature.title}
									</h3>
									<p className="text-gray-600 leading-relaxed">
										{feature.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Skills Assessment Section */}
			<section className="py-20 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-gray-900 mb-4">
							5 Core Skills Assessment
						</h2>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
							Comprehensive evaluation across key competencies that matter most
							for placement success
						</p>
					</div>
					<div className="relative min-h-[400px] w-full flex justify-center">
						<div className="space-y-6 bg-white rounded-2xl shadow-xl p-8 w-full">
							{skills.map((skill, index) => (
								<div
									key={index}
									className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
									<div className="text-blue-600">{skill.icon}</div>
									<div className="flex-1">
										<div className="text-sm font-medium text-gray-900">
											{skill.title}
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2 mt-1">
											<div
												className="bg-blue-600 h-2 rounded-full transition-all duration-700"
												style={{ width: `${85 - index * 10}%` }}></div>
										</div>
									</div>
									<div className="text-sm text-gray-600">
										{85 - index * 10}%
									</div>
								</div>
							))}
						</div>
						{/* Floating Top Right Element - outside the container */}
						<div className="absolute -top-10 right-0 lg:-right-10 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg z-10">
							<Award className="w-10 h-10 text-white" />
						</div>

						{/* Floating Bottom Left Element - outside the container */}
						<div className="absolute -bottom-10 left-0 lg:-left-10 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg z-10">
							<TrendingUp className="w-8 h-8 text-white" />
						</div>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-15">
						{skills.map((skill, index) => (
							<div
								key={index}
								className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
								<div className="text-blue-600 mb-4">{skill.icon}</div>
								<h3 className="text-xl font-semibold text-gray-900 mb-3">
									{skill.title}
								</h3>
								<p className="text-gray-600">{skill.description}</p>
							</div>
						))}
						<div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-2xl text-white md:col-span-2 lg:col-span-1">
							<Sparkles className="w-8 h-8 mb-4" />
							<h3 className="text-xl font-semibold mb-3">
								Comprehensive Analysis
							</h3>
							<p className="text-blue-100 mb-4">
								Get detailed insights and placement recommendations based on all
								skill assessments combined.
							</p>
							<div className="flex items-center text-blue-200">
								<span className="text-sm">Learn more</span>
								<ChevronRight className="w-4 h-4 ml-1" />
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Placement Statistics Section */}
			<PlacementStats />

			{/* Programs Section */}
			<section
				id="programs"
				className="py-20 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-gray-900 mb-4">
							Supported Programs
						</h2>
						<p className="text-xl text-gray-600">
							Assessment platform designed for diverse academic programs
						</p>
					</div>
					<div className="flex flex-wrap justify-around">
						{programs.map((program, index) => (
							<div
								key={index}
								className="bg-gray-50 p-6 rounded-xl text-center hover:bg-blue-50 hover:text-blue-700 transition-colors duration-300 group">
								<div className="text-lg font-semibold">{program}</div>
								<div className="w-8 h-1 bg-blue-600 mx-auto mt-2 group-hover:w-12 transition-all duration-300"></div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Testimonials Section */}
			<section className="py-20 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-gray-900 mb-4">
							What Educators Say
						</h2>
						<p className="text-xl text-gray-600">
							Trusted by educational institutions across the country
						</p>
					</div>
					<div className="grid md:grid-cols-3 gap-8">
						{testimonials.map((testimonial, index) => (
							<div
								key={index}
								className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
								<div className="flex mb-4">
									{[...Array(testimonial.rating)].map((_, i) => (
										<Star
											key={i}
											className="w-5 h-5 text-yellow-400 fill-current"
										/>
									))}
								</div>
								<p className="text-gray-600 mb-6 italic">
									&ldquo;{testimonial.content}&rdquo;
								</p>
								<div>
									<div className="font-semibold text-gray-900">
										{testimonial.name}
									</div>
									<div className="text-sm text-gray-500">
										{testimonial.role}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="text-4xl font-bold text-white mb-4">
						Ready to Transform Your Placement Process?
					</h2>
					<p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
						Join educational institutions that are already using our platform to
						enhance student placement outcomes through comprehensive skill
						assessment.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<button
							onClick={() => router.push("/dashboard")}
							className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors font-semibold flex items-center justify-center group">
							Start Assessment
							<ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
						</button>
						<button className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-colors font-semibold">
							Schedule Demo
						</button>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer
				id="contact"
				className="bg-gray-900 text-white py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid md:grid-cols-4 gap-8">
						<div className="md:col-span-2">
							<div className="flex items-center space-x-3 mb-4">
								<div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
									<GraduationCap className="w-6 h-6 text-white" />
								</div>
								<div>
									<h3 className="text-xl font-bold">
										Aditya Group Of Institutions
									</h3>
									<p className="text-gray-400 text-sm">
										Placement Assessment Platform
									</p>
								</div>
							</div>
							<p className="text-gray-400 mb-6 max-w-md">
								Empowering educational institutions with comprehensive student
								assessment and placement analytics for better career outcomes.
							</p>
							<div className="space-y-2 max-w-md">
								<div className="flex items-center space-x-3 text-gray-400">
									<MapPin className="w-5 h-5" />
									<span> Mumbai - 400092, Maharashtra, India </span>
								</div>
								<div className="flex items-center space-x-3 text-gray-400">
									<Mail className="w-5 h-5" />
									<span> info@adityagroup.edu.in </span>
								</div>
								<div className="flex items-center space-x-3 text-gray-400">
									<Phone className="w-5 h-5" />
									<span> +91 22 3520 6111 / 12 </span>
								</div>
							</div>
						</div>
						<div>
							<h4 className="text-lg font-semibold mb-4">Quick Links</h4>
							<ul className="space-y-2">
								<li>
									<a
										href="#about"
										className="text-gray-400 hover:text-white transition-colors">
										About Platform
									</a>
								</li>
								<li>
									<a
										href="#features"
										className="text-gray-400 hover:text-white transition-colors">
										Features
									</a>
								</li>
								<li>
									<a
										href="#programs"
										className="text-gray-400 hover:text-white transition-colors">
										Programs
									</a>
								</li>
								<li>
									<a
										href="/dashboard"
										className="text-gray-400 hover:text-white transition-colors">
										Dashboard
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h4 className="text-lg font-semibold mb-4">Assessment Areas</h4>
							<ul className="space-y-2">
								<li className="text-gray-400">Technical Skills</li>
								<li className="text-gray-400">Communication</li>
								<li className="text-gray-400">Digital Literacy</li>
								<li className="text-gray-400">Interpersonal Skills</li>
								<li className="text-gray-400">Creativity</li>
							</ul>
						</div>
					</div>
					<div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
						<p className="text-gray-400 text-sm">
							© 2025 Aditya Group Of Institutions. All rights reserved.
						</p>
						<div className="flex items-center space-x-6 mt-4 md:mt-0">
							<div className="flex items-center space-x-2 text-gray-400">
								<Shield className="w-4 h-4" />
								<span className="text-sm">Secure Platform</span>
							</div>
							<div className="flex items-center space-x-2 text-gray-400">
								<CheckCircle className="w-4 h-4" />
								<span className="text-sm">GDPR Compliant</span>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}

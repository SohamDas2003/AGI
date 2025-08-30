"use client";

import React from "react";
import { useRouter } from "next/navigation";
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
} from "lucide-react";

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

	const programs = [
		"MBA",
		"MCA",
		"PGDM",
		"BMS",
		"B.Arch.",
		"BFA Applied Art",
		"B.Voc. Interior Design",
		"M.Arch",
	];

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
									Placement Assessment Platform
								</p>
							</div>
						</div>
						<nav className="hidden md:flex items-center space-x-8">
							<a
								href="#about"
								className="text-gray-600 hover:text-blue-600 transition-colors">
								About
							</a>
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
			<section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						<div className="space-y-8">
							<div className="space-y-4">
								<h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
									Educational
									<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
										{" "}
										Excellence
									</span>{" "}
									in Placement Assessment
								</h1>
								<p className="text-xl text-gray-600 leading-relaxed">
									Comprehensive web-based platform designed for educational
									institutes to assess students across 5 key skill areas and
									provide detailed analytics for both students and
									administrators.
								</p>
							</div>

							<div className="flex flex-col sm:flex-row gap-4">
								<button
									onClick={() => router.push("/dashboard")}
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

						<div className="relative">
							<div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
								<div className="space-y-6">
									<div className="flex items-center justify-between">
										<h3 className="text-xl font-semibold text-gray-900">
											Assessment Dashboard
										</h3>
										<div className="w-3 h-3 bg-green-500 rounded-full"></div>
									</div>

									<div className="space-y-4">
										{skills.slice(0, 3).map((skill, index) => (
											<div
												key={index}
												className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
												<div className="text-blue-600">{skill.icon}</div>
												<div className="flex-1">
													<div className="text-sm font-medium text-gray-900">
														{skill.title}
													</div>
													<div className="w-full bg-gray-200 rounded-full h-2 mt-1">
														<div
															className="bg-blue-600 h-2 rounded-full"
															style={{ width: `${85 - index * 10}%` }}></div>
													</div>
												</div>
												<div className="text-sm text-gray-600">
													{85 - index * 10}%
												</div>
											</div>
										))}
									</div>
								</div>
							</div>

							{/* Floating Elements */}
							<div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
								<Award className="w-10 h-10 text-white" />
							</div>
							<div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
								<TrendingUp className="w-8 h-8 text-white" />
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section
				id="features"
				className="py-20 bg-white">
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

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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

						{/* Overall Assessment Card */}
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

					<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
							<div className="space-y-2">
								<div className="flex items-center space-x-3 text-gray-400">
									<MapPin className="w-5 h-5" />
									<span>Mumbai, Maharashtra, India</span>
								</div>
								<div className="flex items-center space-x-3 text-gray-400">
									<Mail className="w-5 h-5" />
									<span>info@adityagroup.edu.in</span>
								</div>
								<div className="flex items-center space-x-3 text-gray-400">
									<Phone className="w-5 h-5" />
									<span>+91 22 1234 5678</span>
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

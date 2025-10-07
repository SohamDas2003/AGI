"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
	GraduationCap,
	Shield,
	CheckCircle,
	ArrowRight,
	Mail,
	Phone,
	MapPin,
} from "lucide-react";

export default function HomePage() {
	const router = useRouter();

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
				className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-[calc(100vh-4rem)] flex items-center py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex flex-col gap-20 items-center">
						<div className="space-y-8 w-full">
							<div className="space-y-4">
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
						</div>
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
										Self Assessment Platform
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

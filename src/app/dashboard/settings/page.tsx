"use client";

import { useState } from "react";
import {
	Save,
	User,
	Lock,
	Bell,
	Database,
	Shield,
	Monitor,
} from "lucide-react";

interface SettingSection {
	id: string;
	name: string;
	icon: React.ComponentType<{ className?: string }>;
}

const settingSections: SettingSection[] = [
	{ id: "profile", name: "Profile", icon: User },
	{ id: "security", name: "Security", icon: Lock },
	{ id: "notifications", name: "Notifications", icon: Bell },
	{ id: "system", name: "System", icon: Monitor },
	{ id: "data", name: "Data Management", icon: Database },
	{ id: "admin", name: "Admin Settings", icon: Shield },
];

export default function SettingsPage() {
	const [activeSection, setActiveSection] = useState("profile");
	const [profileData, setProfileData] = useState({
		firstName: "Admin",
		lastName: "User",
		email: "admin@agi.edu",
		phone: "+91 9876543210",
		role: "super_admin",
		institution: "Aditya Group Of Institutions",
	});

	const [securitySettings, setSecuritySettings] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
		twoFactorEnabled: false,
		sessionTimeout: "30",
	});

	const [notificationSettings, setNotificationSettings] = useState({
		emailNotifications: true,
		smsNotifications: false,
		assessmentCompleted: true,
		newStudentRegistration: true,
		placementUpdates: true,
		systemAlerts: true,
	});

	const [systemSettings, setSystemSettings] = useState({
		language: "en",
		timezone: "Asia/Kolkata",
		dateFormat: "DD/MM/YYYY",
		theme: "light",
		autoLogout: "60",
	});

	const handleSave = () => {
		// Handle save logic here
		console.log("Settings saved");
	};

	const renderProfileSection = () => (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Profile Information
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							First Name
						</label>
						<input
							type="text"
							value={profileData.firstName}
							onChange={(e) =>
								setProfileData({ ...profileData, firstName: e.target.value })
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Last Name
						</label>
						<input
							type="text"
							value={profileData.lastName}
							onChange={(e) =>
								setProfileData({ ...profileData, lastName: e.target.value })
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Email
						</label>
						<input
							type="email"
							value={profileData.email}
							onChange={(e) =>
								setProfileData({ ...profileData, email: e.target.value })
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Phone
						</label>
						<input
							type="tel"
							value={profileData.phone}
							onChange={(e) =>
								setProfileData({ ...profileData, phone: e.target.value })
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Role
						</label>
						<select
							value={profileData.role}
							onChange={(e) =>
								setProfileData({ ...profileData, role: e.target.value })
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
							<option value="admin">Admin</option>
							<option value="super_admin">Super Admin</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Institution
						</label>
						<input
							type="text"
							value={profileData.institution}
							onChange={(e) =>
								setProfileData({ ...profileData, institution: e.target.value })
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
				</div>
			</div>
		</div>
	);

	const renderSecuritySection = () => (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Change Password
				</h3>
				<div className="space-y-4 max-w-md">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Current Password
						</label>
						<input
							type="password"
							value={securitySettings.currentPassword}
							onChange={(e) =>
								setSecuritySettings({
									...securitySettings,
									currentPassword: e.target.value,
								})
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							New Password
						</label>
						<input
							type="password"
							value={securitySettings.newPassword}
							onChange={(e) =>
								setSecuritySettings({
									...securitySettings,
									newPassword: e.target.value,
								})
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Confirm New Password
						</label>
						<input
							type="password"
							value={securitySettings.confirmPassword}
							onChange={(e) =>
								setSecuritySettings({
									...securitySettings,
									confirmPassword: e.target.value,
								})
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
				</div>
			</div>

			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Security Options
				</h3>
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<h4 className="text-sm font-medium text-gray-900">
								Two-Factor Authentication
							</h4>
							<p className="text-sm text-gray-500">
								Add an extra layer of security to your account
							</p>
						</div>
						<label className="relative inline-flex items-center cursor-pointer">
							<input
								type="checkbox"
								checked={securitySettings.twoFactorEnabled}
								onChange={(e) =>
									setSecuritySettings({
										...securitySettings,
										twoFactorEnabled: e.target.checked,
									})
								}
								className="sr-only peer"
							/>
							<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
						</label>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Session Timeout (minutes)
						</label>
						<select
							value={securitySettings.sessionTimeout}
							onChange={(e) =>
								setSecuritySettings({
									...securitySettings,
									sessionTimeout: e.target.value,
								})
							}
							className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
							<option value="15">15 minutes</option>
							<option value="30">30 minutes</option>
							<option value="60">1 hour</option>
							<option value="120">2 hours</option>
						</select>
					</div>
				</div>
			</div>
		</div>
	);

	const renderNotificationSection = () => (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Notification Preferences
				</h3>
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<h4 className="text-sm font-medium text-gray-900">
								Email Notifications
							</h4>
							<p className="text-sm text-gray-500">
								Receive notifications via email
							</p>
						</div>
						<label className="relative inline-flex items-center cursor-pointer">
							<input
								type="checkbox"
								checked={notificationSettings.emailNotifications}
								onChange={(e) =>
									setNotificationSettings({
										...notificationSettings,
										emailNotifications: e.target.checked,
									})
								}
								className="sr-only peer"
							/>
							<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
						</label>
					</div>

					<div className="flex items-center justify-between">
						<div>
							<h4 className="text-sm font-medium text-gray-900">
								SMS Notifications
							</h4>
							<p className="text-sm text-gray-500">
								Receive notifications via SMS
							</p>
						</div>
						<label className="relative inline-flex items-center cursor-pointer">
							<input
								type="checkbox"
								checked={notificationSettings.smsNotifications}
								onChange={(e) =>
									setNotificationSettings({
										...notificationSettings,
										smsNotifications: e.target.checked,
									})
								}
								className="sr-only peer"
							/>
							<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
						</label>
					</div>

					<div className="border-t pt-4">
						<h4 className="text-sm font-medium text-gray-900 mb-3">
							Notification Types
						</h4>
						<div className="space-y-3">
							{[
								{
									key: "assessmentCompleted",
									label: "Assessment Completed",
									desc: "When a student completes an assessment",
								},
								{
									key: "newStudentRegistration",
									label: "New Student Registration",
									desc: "When a new student is registered",
								},
								{
									key: "placementUpdates",
									label: "Placement Updates",
									desc: "Updates on student placements",
								},
								{
									key: "systemAlerts",
									label: "System Alerts",
									desc: "Important system notifications",
								},
							].map((item) => (
								<div
									key={item.key}
									className="flex items-center justify-between">
									<div>
										<h5 className="text-sm font-medium text-gray-900">
											{item.label}
										</h5>
										<p className="text-xs text-gray-500">{item.desc}</p>
									</div>
									<label className="relative inline-flex items-center cursor-pointer">
										<input
											type="checkbox"
											checked={
												notificationSettings[
													item.key as keyof typeof notificationSettings
												] as boolean
											}
											onChange={(e) =>
												setNotificationSettings({
													...notificationSettings,
													[item.key]: e.target.checked,
												})
											}
											className="sr-only peer"
										/>
										<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
									</label>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	const renderSystemSection = () => (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					System Preferences
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Language
						</label>
						<select
							value={systemSettings.language}
							onChange={(e) =>
								setSystemSettings({
									...systemSettings,
									language: e.target.value,
								})
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
							<option value="en">English</option>
							<option value="hi">Hindi</option>
							<option value="mr">Marathi</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Timezone
						</label>
						<select
							value={systemSettings.timezone}
							onChange={(e) =>
								setSystemSettings({
									...systemSettings,
									timezone: e.target.value,
								})
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
							<option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
							<option value="UTC">UTC</option>
							<option value="America/New_York">America/New_York (EST)</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Date Format
						</label>
						<select
							value={systemSettings.dateFormat}
							onChange={(e) =>
								setSystemSettings({
									...systemSettings,
									dateFormat: e.target.value,
								})
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
							<option value="DD/MM/YYYY">DD/MM/YYYY</option>
							<option value="MM/DD/YYYY">MM/DD/YYYY</option>
							<option value="YYYY-MM-DD">YYYY-MM-DD</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Theme
						</label>
						<select
							value={systemSettings.theme}
							onChange={(e) =>
								setSystemSettings({ ...systemSettings, theme: e.target.value })
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
							<option value="light">Light</option>
							<option value="dark">Dark</option>
							<option value="auto">Auto</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Auto Logout (minutes)
						</label>
						<select
							value={systemSettings.autoLogout}
							onChange={(e) =>
								setSystemSettings({
									...systemSettings,
									autoLogout: e.target.value,
								})
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
							<option value="30">30 minutes</option>
							<option value="60">1 hour</option>
							<option value="120">2 hours</option>
							<option value="240">4 hours</option>
						</select>
					</div>
				</div>
			</div>
		</div>
	);

	const renderDataSection = () => (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Data Management
				</h3>
				<div className="space-y-4">
					<div className="p-4 border border-gray-200 rounded-lg">
						<h4 className="text-sm font-medium text-gray-900 mb-2">
							Database Backup
						</h4>
						<p className="text-sm text-gray-500 mb-3">
							Create a backup of all assessment and student data
						</p>
						<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
							Create Backup
						</button>
					</div>
					<div className="p-4 border border-gray-200 rounded-lg">
						<h4 className="text-sm font-medium text-gray-900 mb-2">
							Data Export
						</h4>
						<p className="text-sm text-gray-500 mb-3">
							Export all data for external analysis
						</p>
						<button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
							Export Data
						</button>
					</div>
					<div className="p-4 border border-red-200 rounded-lg bg-red-50">
						<h4 className="text-sm font-medium text-red-900 mb-2">
							Data Cleanup
						</h4>
						<p className="text-sm text-red-700 mb-3">
							Remove old assessment data and logs (irreversible)
						</p>
						<button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
							Cleanup Data
						</button>
					</div>
				</div>
			</div>
		</div>
	);

	const renderAdminSection = () => (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Admin Settings
				</h3>
				<div className="space-y-4">
					<div className="p-4 border border-gray-200 rounded-lg">
						<h4 className="text-sm font-medium text-gray-900 mb-2">
							User Management
						</h4>
						<p className="text-sm text-gray-500 mb-3">
							Manage admin users and permissions
						</p>
						<button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
							Manage Users
						</button>
					</div>
					<div className="p-4 border border-gray-200 rounded-lg">
						<h4 className="text-sm font-medium text-gray-900 mb-2">
							System Logs
						</h4>
						<p className="text-sm text-gray-500 mb-3">
							View system activity and error logs
						</p>
						<button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
							View Logs
						</button>
					</div>
					<div className="p-4 border border-gray-200 rounded-lg">
						<h4 className="text-sm font-medium text-gray-900 mb-2">
							Assessment Configuration
						</h4>
						<p className="text-sm text-gray-500 mb-3">
							Configure assessment parameters and scoring
						</p>
						<button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
							Configure
						</button>
					</div>
				</div>
			</div>
		</div>
	);

	const renderContent = () => {
		switch (activeSection) {
			case "profile":
				return renderProfileSection();
			case "security":
				return renderSecuritySection();
			case "notifications":
				return renderNotificationSection();
			case "system":
				return renderSystemSection();
			case "data":
				return renderDataSection();
			case "admin":
				return renderAdminSection();
			default:
				return renderProfileSection();
		}
	};

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Settings</h1>
					<p className="text-gray-600">
						Manage your account and system preferences
					</p>
				</div>
				<button
					onClick={handleSave}
					className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
					<Save className="w-4 h-4" />
					Save Changes
				</button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				{/* Sidebar */}
				<div className="bg-white rounded-lg border border-gray-200 p-4">
					<nav className="space-y-2">
						{settingSections.map((section) => {
							const IconComponent = section.icon;
							return (
								<button
									key={section.id}
									onClick={() => setActiveSection(section.id)}
									className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
										activeSection === section.id
											? "bg-blue-100 text-blue-700"
											: "text-gray-600 hover:bg-gray-100"
									}`}>
									<IconComponent className="w-4 h-4" />
									{section.name}
								</button>
							);
						})}
					</nav>
				</div>

				{/* Content */}
				<div className="lg:col-span-3 bg-white rounded-lg border border-gray-200 p-6">
					{renderContent()}
				</div>
			</div>
		</div>
	);
}

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	serverExternalPackages: ["xlsx", "jsonwebtoken"],
	// Headers for better CORS and security
	async headers() {
		return [
			{
				source: "/api/:path*",
				headers: [
					{
						key: "Access-Control-Allow-Credentials",
						value: "true",
					},
				],
			},
		];
	},
};

export default nextConfig;

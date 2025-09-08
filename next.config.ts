import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		serverComponentsExternalPackages: ["xlsx"],
	},
	api: {
		bodyParser: {
			sizeLimit: "10mb",
		},
	},
};

export default nextConfig;

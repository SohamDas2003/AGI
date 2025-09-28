// Simple debug script to test authentication
// Run with: node scripts/debug-auth.js

import https from "https";
import http from "http";

const BASE_URL = process.argv[2] || "http://localhost:3000";

console.log(`🔍 Testing authentication on: ${BASE_URL}`);

// Test function
async function testAuth() {
	console.log("\n1. Testing /api/debug/cookies endpoint...");

	try {
		const url = new URL("/api/debug/cookies", BASE_URL);
		const client = url.protocol === "https:" ? https : http;

		const response = await new Promise((resolve, reject) => {
			const req = client.get(url, (res) => {
				let data = "";
				res.on("data", (chunk) => (data += chunk));
				res.on("end", () =>
					resolve({ status: res.statusCode, data: JSON.parse(data) })
				);
			});
			req.on("error", reject);
			req.setTimeout(10000, () => reject(new Error("Timeout")));
		});

		console.log("✅ Debug endpoint response:");
		console.log(JSON.stringify(response.data, null, 2));

		// Test login
		console.log("\n2. Testing /api/auth/me endpoint...");

		const meUrl = new URL("/api/auth/me", BASE_URL);
		const meResponse = await new Promise((resolve, reject) => {
			const req = client.get(meUrl, (res) => {
				let data = "";
				res.on("data", (chunk) => (data += chunk));
				res.on("end", () =>
					resolve({ status: res.statusCode, data: JSON.parse(data) })
				);
			});
			req.on("error", reject);
			req.setTimeout(10000, () => reject(new Error("Timeout")));
		});

		console.log(`Status: ${meResponse.status}`);
		console.log("Response:", JSON.stringify(meResponse.data, null, 2));
	} catch (error) {
		console.error("❌ Error testing auth:", error.message);
	}
}

testAuth();

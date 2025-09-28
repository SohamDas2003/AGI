#!/usr/bin/env node

/**
 * Superadmin Creation Script
 *
 * This script creates a superadmin user in the AIMSR database.
 * Run this script to initialize the first superadmin account.
 *
 * Usage:
 *   npm run create-superadmin
 *   or
 *   node scripts/create-superadmin.js
 */

/* eslint-disable */
// Load environment variables from a local .env file when available
require("dotenv").config();

const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
const readline = require("readline");

// Configuration
// Determine MongoDB URI from CLI (--uri), environment, or default to localhost.
// Prefer explicit CLI or environment values so users don't accidentally use
// the wrong database.
function getMongoUriFromArgs() {
	const raw = process.argv.slice(2);
	for (const a of raw) {
		if (a.startsWith("--uri=")) return a.split("=", 2)[1];
	}
	const i = raw.indexOf("--uri");
	if (i !== -1 && raw[i + 1]) return raw[i + 1];
	return null;
}

const CLI_MONGODB_URI = getMongoUriFromArgs();
// NOTE: a project-specific Atlas URI was previously embedded here. To preserve
// previous behavior (useful for CI/dev), fall back to that URI if nothing else
// is provided. Prefer providing `MONGODB_URI` via env or `--uri` on the CLI.
const DEFAULT_FALLBACK_ATLAS =
	process.env.__FALLBACK_ATLAS_URI ||
	"mongodb+srv://sohamdas2003:Soham2003@cluster0.jeg3n7i.mongodb.net/";

const MONGODB_URI =
	CLI_MONGODB_URI || process.env.MONGODB_URI || DEFAULT_FALLBACK_ATLAS;
const DATABASE_NAME = "aimsr_db";

// Create readline interface for user input
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

// Function to prompt user for input
function prompt(question) {
	return new Promise((resolve) => {
		rl.question(question, resolve);
	});
}

// Function to hash password
async function hashPassword(password) {
	const saltRounds = 12;
	return await bcrypt.hash(password, saltRounds);
}

// Main function to create superadmin
async function createSuperAdmin() {
	let client;

	try {
		console.log("🚀 AIMSR Super Administrator Creation Script");
		console.log("============================================\n");

		// Connect to MongoDB (short selection timeout so failures surface quickly)
		console.log("📡 Connecting to MongoDB... (URI:", MONGODB_URI, ")");
		client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
		try {
			await client.connect();
		} catch (connectErr) {
			console.error("❌ Could not connect to MongoDB:", connectErr.message);
			console.error(
				"Please set the MONGODB_URI environment variable or pass --uri <connection-string>."
			);
			throw connectErr;
		}

		const db = client.db(DATABASE_NAME);
		console.log("✅ Connected to database successfully\n");

		// Check if superadmin already exists
		const existingSuperAdmin = await db
			.collection("users")
			.findOne({ role: "SUPERADMIN" });

		if (existingSuperAdmin) {
			console.log("⚠️  Super Administrator already exists!");
			console.log(`📧 Email: ${existingSuperAdmin.email}`);
			console.log(
				`👤 Name: ${existingSuperAdmin.firstName} ${existingSuperAdmin.lastName}`
			);

			const overwrite = await prompt(
				"\n❓ Do you want to create a new superadmin anyway? (y/N): "
			);

			if (
				overwrite.toLowerCase() !== "y" &&
				overwrite.toLowerCase() !== "yes"
			) {
				console.log("❌ Operation cancelled");
				return;
			}
		}

		// Get superadmin details from user
		console.log("\n📝 Please provide Super Administrator details:");

		const firstName =
			(await prompt("👤 First Name (default: Super): ")) || "Super";
		const lastName =
			(await prompt("👤 Last Name (default: Administrator): ")) ||
			"Administrator";

		let email;
		do {
			email =
				(await prompt("📧 Email (default: superadmin@aimsr.edu.in): ")) ||
				"superadmin@aimsr.edu.in";

			// Validate email format
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				console.log("❌ Invalid email format. Please try again.");
				email = null;
			}
		} while (!email);

		let password;
		do {
			password =
				(await prompt("🔐 Password (default: SuperAdmin@123): ")) ||
				"SuperAdmin@123";

			// Validate password strength
			if (password.length < 8) {
				console.log(
					"❌ Password must be at least 8 characters long. Please try again."
				);
				password = null;
			}
		} while (!password);

		// Create superadmin data
		const superAdminData = {
			email: email,
			password: await hashPassword(password),
			role: "SUPERADMIN",
			firstName: firstName,
			lastName: lastName,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		console.log("\n🔄 Creating Super Administrator...");

		// Insert the superadmin
		const result = await db.collection("users").insertOne(superAdminData);

		if (result.insertedId) {
			console.log("✅ Super Administrator created successfully!");
			console.log("\n📋 Super Administrator Details:");
			console.log(`   ID: ${result.insertedId}`);
			console.log(`   Email: ${email}`);
			console.log(`   Name: ${firstName} ${lastName}`);
			console.log(`   Role: SUPERADMIN`);
			console.log(`   Created: ${new Date().toLocaleString()}`);

			console.log("\n🔑 Login Credentials:");
			console.log(`   Email: ${email}`);
			console.log(`   Password: ${password}`);

			console.log(
				"\n⚠️  IMPORTANT: Please save these credentials securely and change the password after first login!"
			);
		} else {
			throw new Error("Failed to create Super Administrator");
		}
	} catch (error) {
		console.error("❌ Error creating Super Administrator:", error.message);
		// set non-zero exit code but allow finally block to run
		process.exitCode = 1;
	} finally {
		if (client) {
			await client.close();
			console.log("\n📡 Database connection closed");
		}
		rl.close();
	}
}

// Check if superadmin exists
async function checkSuperAdmin() {
	let client;

	try {
		console.log("🔍 Checking for existing Super Administrator...");

		client = new MongoClient(MONGODB_URI);
		await client.connect();

		const db = client.db(DATABASE_NAME);

		const superAdmin = await db
			.collection("users")
			.findOne({ role: "SUPERADMIN" }, { projection: { password: 0 } });

		if (superAdmin) {
			console.log("✅ Super Administrator found:");
			console.log(`   ID: ${superAdmin._id}`);
			console.log(`   Email: ${superAdmin.email}`);
			console.log(`   Name: ${superAdmin.firstName} ${superAdmin.lastName}`);
			console.log(
				`   Created: ${
					superAdmin.createdAt
						? superAdmin.createdAt.toLocaleString()
						: "Unknown"
				}`
			);
		} else {
			console.log("❌ No Super Administrator found");
		}
	} catch (error) {
		console.error("❌ Error checking Super Administrator:", error.message);
		// set non-zero exit code but allow finally block to run
		process.exitCode = 1;
	} finally {
		if (client) {
			await client.close();
		}
	}
}

// Main execution
async function main() {
	const args = process.argv.slice(2);

	if (args.includes("--check") || args.includes("-c")) {
		await checkSuperAdmin();
	} else if (args.includes("--help") || args.includes("-h")) {
		console.log("AIMSR Super Administrator Creation Script");
		console.log("\nUsage:");
		console.log(
			"  node scripts/create-superadmin.js          Create a new superadmin"
		);
		console.log(
			"  node scripts/create-superadmin.js --check  Check if superadmin exists"
		);
		console.log(
			"  node scripts/create-superadmin.js --help   Show this help message"
		);
	} else {
		await createSuperAdmin();
	}
}

// Run the script
if (require.main === module) {
	main().catch(console.error);
}

module.exports = {
	createSuperAdmin,
	checkSuperAdmin,
};

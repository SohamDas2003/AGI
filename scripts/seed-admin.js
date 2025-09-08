import { connectToDatabase } from "../src/lib/mongodb.js";
import { hashPassword } from "../src/lib/auth.js";

async function seedAdmin() {
	try {
		console.log("Connecting to database...");
		const { db } = await connectToDatabase();
		const usersCollection = db.collection("users");

		// Check if admin already exists
		const existingAdmin = await usersCollection.findOne({
			email: "admin@agi.com",
			role: "admin",
		});

		if (existingAdmin) {
			console.log("Admin user already exists");
			return;
		}

		// Create admin user
		console.log("Creating admin user...");
		const hashedPassword = await hashPassword("admin@123");
		const adminUser = {
			email: "admin@agi.com",
			password: hashedPassword,
			role: "admin",
			name: "Admin User",
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const result = await usersCollection.insertOne(adminUser);
		console.log("Admin user created successfully with ID:", result.insertedId);
	} catch (error) {
		console.error("Error seeding admin user:", error);
	} finally {
		process.exit(0);
	}
}

seedAdmin();

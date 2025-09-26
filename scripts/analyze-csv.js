const fs = require("fs");
const path = require("path");

// Read CSV files
const csv1Path = path.join(__dirname, "../public/mms_students_60_random.csv");
const csv2Path = path.join(__dirname, "../public/Student_Details_Updated.csv");

function parseCSV(content) {
	const lines = content.split("\n").filter((line) => line.trim());
	const headers = lines[0].split(",").map((h) => h.trim());
	const data = lines.slice(1).map((line) => {
		const values = line.split(",").map((v) => v.trim());
		const obj = {};
		headers.forEach((header, index) => {
			obj[header] = values[index] || "";
		});
		return obj;
	});
	return { headers, data };
}

function getUniqueValues(data, field) {
	const values = data
		.map((row) => row[field])
		.filter((val) => val && val.trim());
	return [...new Set(values)].sort();
}

try {
	// Read and parse both files
	const csv1Content = fs.readFileSync(csv1Path, "utf8");
	const csv2Content = fs.readFileSync(csv2Path, "utf8");

	const csv1 = parseCSV(csv1Content);
	const csv2 = parseCSV(csv2Content);

	// Combine data from both files
	const allData = [...csv1.data, ...csv2.data];

	console.log("Headers from CSV files:");
	console.log("CSV1:", csv1.headers);
	console.log("CSV2:", csv2.headers);
	console.log("\n");

	// Extract unique values for dropdown fields
	const dropdownFields = [
		"Site",
		"Batch Name",
		"Academic Session",
		"Class",
		"Student Status",
	];

	const uniqueValues = {};
	dropdownFields.forEach((field) => {
		uniqueValues[field] = getUniqueValues(allData, field);
		console.log(`${field}:`);
		uniqueValues[field].forEach((value) => console.log(`  - ${value}`));
		console.log("");
	});

	// Write to JSON file for use in the application
	const outputPath = path.join(
		__dirname,
		"../src/lib/student-dropdown-data.json"
	);
	fs.writeFileSync(outputPath, JSON.stringify(uniqueValues, null, 2));

	console.log("Unique values written to:", outputPath);
	console.log("\nTotal students in combined data:", allData.length);
} catch (error) {
	console.error("Error:", error.message);
}

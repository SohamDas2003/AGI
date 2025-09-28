// Test script to create a sample assessment
const createTestAssessment = async () => {
	const testAssessment = {
		title: "Test Assessment for Students",
		description: "This is a test assessment to verify the system is working",
		criteria: {
			course: ["ALL"],
			batches: [], // Empty array means all batches
			sites: [],
			academicSessions: [],
			classes: [],
			studentStatus: ["Active"],
		},
		timeLimit: 30,
		instructions: "Please answer all questions honestly.",
		allowMultipleAttempts: false,
		maxAttempts: 1,
		autoAssign: true,
		assignOnLogin: false,
		sections: [
			{
				title: "General Questions",
				description: "Basic assessment questions",
				questions: [
					{
						text: "I feel confident about my technical skills",
						isRequired: true,
						scaleOptions: {
							min: 1,
							max: 5,
							minLabel: "Strongly Disagree",
							maxLabel: "Strongly Agree",
							labels: [
								"Strongly Disagree",
								"Disagree",
								"Neutral",
								"Agree",
								"Strongly Agree",
							],
						},
					},
					{
						text: "I work well in team environments",
						isRequired: true,
						scaleOptions: {
							min: 1,
							max: 5,
							minLabel: "Strongly Disagree",
							maxLabel: "Strongly Agree",
							labels: [
								"Strongly Disagree",
								"Disagree",
								"Neutral",
								"Agree",
								"Strongly Agree",
							],
						},
					},
				],
			},
		],
	};

	try {
		console.log("Creating test assessment...");
		console.log(JSON.stringify(testAssessment, null, 2));

		const response = await fetch("http://localhost:3001/api/assessments", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(testAssessment),
		});

		const result = await response.json();
		console.log("Assessment creation result:", result);

		if (result.success) {
			console.log("✅ Test assessment created successfully");
		} else {
			console.log("❌ Failed to create test assessment:", result.error);
		}
	} catch (error) {
		console.error("❌ Error creating test assessment:", error);
	}
};

// Run the test
createTestAssessment();

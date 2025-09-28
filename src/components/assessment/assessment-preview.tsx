import React from "react";
import { CreateAssessmentForm } from "@/types";

interface AssessmentPreviewProps {
	form: CreateAssessmentForm;
}

const AssessmentPreview: React.FC<AssessmentPreviewProps> = ({ form }) => {
	return (
		<div className="p-4 border rounded-lg">
			<h3 className="text-lg font-semibold mb-2">Assessment Preview</h3>
			<p className="text-gray-600 mb-4">Title: {form.title}</p>
			<p className="text-gray-600 mb-4">Description: {form.description}</p>
			<p className="text-gray-600 mb-4">Course: {form.course}</p>
			<p className="text-gray-600 mb-4">Batch: {form.batch}</p>
			<p className="text-gray-600">Sections: {form.sections.length}</p>
		</div>
	);
};

export default AssessmentPreview;

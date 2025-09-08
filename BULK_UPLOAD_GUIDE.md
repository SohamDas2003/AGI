# Bulk Student Upload Feature

## Overview

The bulk upload feature allows administrators to create multiple student accounts at once by uploading Excel (.xlsx) or CSV files containing student information.

## How to Use

1. **Navigate to Bulk Upload**

   - Go to Dashboard → Bulk Upload
   - You'll see the upload interface with instructions

2. **Download Template**

   - Click the "Template" button to download a sample CSV file
   - The template includes all required and optional fields with example data

3. **Prepare Your Data**

   - Use the downloaded template as a reference
   - Fill in your student data following the format
   - Ensure all required fields are filled

4. **Upload File**

   - Drag and drop your file or click "browse" to select
   - Supported formats: .xlsx, .csv
   - Maximum file size: 10MB
   - Maximum records: 1000 students per upload

5. **Review Results**
   - After upload, you'll see a summary of results
   - Successful imports and any errors will be displayed
   - Fix any errors and re-upload if needed

## Required Fields

| Field       | Description               | Type          | Required |
| ----------- | ------------------------- | ------------- | -------- |
| student_id  | Unique student identifier | String/Number | Yes      |
| roll_number | Student roll number       | String        | Yes      |
| email       | Student email address     | Email         | Yes      |
| first_name  | Student's first name      | String        | Yes      |
| last_name   | Student's last name       | String        | Yes      |
| course      | Academic program          | String        | Yes      |
| division    | Class division/section    | String        | Yes      |
| password    | Default login password    | String        | Yes      |

## Optional Fields

| Field         | Description                 | Type   | Required |
| ------------- | --------------------------- | ------ | -------- |
| phone         | Contact number              | String | No       |
| date_of_birth | Birth date (YYYY-MM-DD)     | Date   | No       |
| gender        | Gender                      | String | No       |
| year_of_study | Current academic year (1-4) | Number | No       |

## Supported Courses

- MBA
- MCA
- PGDM
- BMS
- B.Arch.
- BFA Applied Art
- B.Voc. Interior Design
- M.Arch

## Important Notes

1. **Unique Constraints**

   - Email addresses must be unique across the system
   - Student IDs must be unique across the system
   - Duplicate entries will be rejected

2. **Password Security**

   - Passwords are automatically hashed during upload
   - Students can change their passwords after first login

3. **Date Format**

   - Use YYYY-MM-DD format for dates (e.g., 1999-05-15)
   - Invalid date formats will cause upload errors

4. **Error Handling**

   - The system validates each record before importing
   - Failed records are reported with specific error messages
   - You can fix errors and re-upload the corrected file

5. **File Limits**
   - Maximum file size: 10MB
   - Maximum records per upload: 1000 students
   - First row must contain column headers

## After Upload

Once students are successfully uploaded:

- They can log in using their email and password
- They will have access to the student dashboard
- Their profile information will be populated from the upload data

## Troubleshooting

**Common Errors:**

- Invalid email format: Check email addresses for proper format
- Duplicate student ID/email: Remove duplicates or use unique values
- Invalid course: Ensure course names match supported list
- Missing required fields: Fill in all required columns
- Invalid date format: Use YYYY-MM-DD format

**Best Practices:**

- Always use the provided template
- Validate your data before uploading
- Start with a small batch to test the format
- Keep a backup of your original data

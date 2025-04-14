# ABET Form API

A REST API for managing ABET assessment forms and student progress reports for mentors in educational institutions.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
  - [ABET Form Endpoints](#abet-form-endpoints)
  - [Progress Report Endpoints](#progress-report-endpoints)
  - [File Upload Endpoints](#file-upload-endpoints)
- [Authentication](#authentication)
- [Usage Examples](#usage-examples)
- [Response Structure](#response-structure)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

## Features

- Retrieve and submit ABET assessment forms for mentors
- Create and view brief progress reports for students
- Upload and manage various student document files
- Authentication system for mentors and students
- Comprehensive API for educational assessment tracking

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/abet-form-api.git

# Navigate to the project directory
cd abet-form-api

# Install dependencies
npm install

# Set up environment variables (create a .env file)
touch .env

# Add the following to your .env file
PORT=4000
MONGODB_URI=mongodb://localhost:27017/abet-form-db
JWT_SECRET=your_jwt_secret

# Start the server
npm start
```

## API Endpoints

### ABET Form Endpoints

#### Get ABET Form for Mentor
- **GET**: `/mentors/getAbetForm/:mentorId`
- **Description**: Retrieves the ABET assessment form for a specific mentor
- **Authentication**: Required (Bearer Token)
- **Path Params**: 
  - `mentorId`: ID of the mentor

#### Submit ABET Form for Mentor
- **POST**: `/mentors/submitAbetForm/:mentorId`
- **Description**: Submits an ABET assessment form for a specific mentor
- **Authentication**: Required (Bearer Token)
- **Path Params**: 
  - `mentorId`: ID of the mentor
- **Request Body**:
  ```json
  {
    "levels": {
      "questionId1": 4,
      "questionId2": 5,
      "questionId3": 3
    },
    "suggestedCourse": "Cloud Computing",
    "overallSatisfaction": "Excellent"
  }
  ```

### Progress Report Endpoints

#### Get Brief Progress Report
- **GET**: `/mentors/breifProgressReport/:studentId`
- **Description**: Retrieves the brief progress report for a specific student
- **Authentication**: Required (Bearer Token)
- **Path Params**: 
  - `studentId`: ID of the student

#### Submit Brief Progress Report
- **POST**: `/mentors/submitBriefProgressReport/:studentId`
- **Description**: Submits a brief progress report for a specific student
- **Authentication**: Required (Bearer Token)
- **Path Params**: 
  - `studentId`: ID of the student
- **Request Body**:
  ```json
  {
    "topicOfProject": "ERP Development",
    "typeOfProject": "Software Development",
    "assignment1Details": "Build frontend",
    "assignment1Status": "On Going",
    "assignment2Details": "Setup backend",
    "assignment2Status": "Pending",
    "assignment3Details": "Deploy to server",
    "assignment3Status": "Choose One...",
    "hrName": "John Doe",
    "hrContactNumber": "9876543210",
    "hrEmailId": "john.doe@example.com",
    "remarksByIndustryCoordinator": "Good progress so far."
  }
  ```

### File Upload Endpoints

#### Get File Upload Information
- **GET**: `/students/getFileUploadInfo`
- **Description**: Retrieves information about which files have been uploaded by a student
- **Authentication**: Required (Student Token)

#### Upload Files
The API provides multiple endpoints for uploading different types of documents:

- **POST**: `/students/uploadfile` - Upload training letter
- **POST**: `/students/uploadfiles` - Upload fee receipt
- **POST**: `/students/uploadgoalreport` - Upload goal report
- **POST**: `/students/uploadmidwayreport` - Upload midway report
- **POST**: `/students/uploadreportfile` - Upload report file
- **POST**: `/students/uploadprojectpresentation` - Upload project presentation
- **POST**: `/students/uploadfinaltraining` - Upload final training document

All upload endpoints:
- **Authentication**: Required (Student Token)
- **Content-Type**: `multipart/form-data`
- **Form Field**: Check specific field name in the endpoint path

## Authentication

The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header as follows:

```
Authorization: Bearer <your_token>
```

There are two types of authentication:
- `authStudent`: For student-specific endpoints
- `authMentor`: For mentor-specific endpoints

## Usage Examples

### Getting an ABET Form

```javascript
const fetchAbetForm = async (mentorId, authToken) => {
  try {
    const response = await fetch(`http://localhost:4000/mentors/getAbetForm/${mentorId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching ABET form:', error);
  }
};
```

### Submitting a Brief Progress Report

```javascript
const submitProgressReport = async (studentId, reportData, authToken) => {
  try {
    const response = await fetch(`http://localhost:4000/mentors/submitBriefProgressReport/${studentId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reportData)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting progress report:', error);
  }
};
```

### Uploading a Document

```javascript
const uploadTrainingLetter = async (fileData, authToken) => {
  try {
    const formData = new FormData();
    formData.append('trainingLetter', fileData);
    
    const response = await fetch('http://localhost:4000/students/uploadfile', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: formData
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading training letter:', error);
  }
};
```

## Response Structure

### ABET Form Response
```json
{
  "mentorId": "67b85e615d284f70594721d6",
  "suggestedCourse": "",
  "overallSatisfaction": "",
  "questions": [
    {
      "_id": "67fb8c3b6b5f9d676e263e78",
      "text": "TIET CSE students have an ability to apply knowledge of mathematics, science, and engineering.",
      "selectedValue": null
    },
    // More questions...
  ]
}
```

### Brief Progress Report Response
```json
{
  "success": true,
  "data": {
    "rollNumber": "102317050",
    "studentName": "Pratham Poudel",
    "companyName": "Chandrauta Hospital Pvt.Ltd",
    "companyAddress": "Shivraj,Kapilvastu",
    "dateOfVisit": "2025-02-21T12:37:14.996Z",
    "progressReport": {
      "_id": "67fbeafcdf03887ebc59ed40",
      "student": "67b8737a42fbf3b8f43c47ad",
      "topicOfProject": "ERP Development",
      "typeOfProject": "Software Development",
      // More fields...
    }
  }
}
```

### File Upload Info Response
```json
{
  "fileUploadInfo": {
    "trainingLetter": "3477a48e-3ce7-44a2-a105-33992f3b4afc.pdf",
    "feeReceipt": "629c965f-e145-49ea-a781-e94f394b89bb.pdf",
    "goalReport": "62320649-2b7f-44a2-afcb-92ad8c332c19.pdf",
    "midwayReport": null,
    "reportFile": null,
    "projectPresentation": null,
    "finalTraining": null
  }
}
```

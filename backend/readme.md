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
    const response = await fetch(
      `http://localhost:4000/mentors/getAbetForm/${mentorId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching ABET form:", error);
  }
};
```

### Submitting a Brief Progress Report

```javascript
const submitProgressReport = async (studentId, reportData, authToken) => {
  try {
    const response = await fetch(
      `http://localhost:4000/mentors/submitBriefProgressReport/${studentId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error submitting progress report:", error);
  }
};
```

### Uploading a Document

```javascript
const uploadTrainingLetter = async (fileData, authToken) => {
  try {
    const formData = new FormData();
    formData.append("trainingLetter", fileData);

    const response = await fetch("http://localhost:4000/students/uploadfile", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error uploading training letter:", error);
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
    }
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
      "typeOfProject": "Software Development"
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

# Student Feedback Form ABET

### GET Student Feedback Form ABET

- **GET**: `/students/getFeedbackFormAbet/:studentId`
- **Response**:
  ```json
  {
    "studentId": "67b871b057e338fa24e3163e",
    "questions": [
      {
        "_id": "67fc9cb5cdeca397d0ad506f", //question's id
        "text": "An ability to apply knowledge of mathematics, science, and engineering.", //question
        "selectedValue": 3
      },
      {
        "_id": "67fc9cb5cdeca397d0ad5070",
        "text": "An ability to design and conduct experiments, as well as to analyze and interpret data.",
        "selectedValue": 4
      },
      {
        "_id": "67fc9cb5cdeca397d0ad5071",
        "text": "An ability to design a system, component, or process to meet desired needs within realistic constraints such as economic, environmental, social, political, ethical, health and safety, manufacturability, and sustainability.",
        "selectedValue": 5
      },
      {
        "_id": "67fc9cb5cdeca397d0ad5072",
        "text": "An ability to function on multidisciplinary teams.",
        "selectedValue": 5
      },
      {
        "_id": "67fc9cb5cdeca397d0ad5073",
        "text": "An ability to identify, formulates, and solves engineering problems.",
        "selectedValue": 5
      },
      {
        "_id": "67fc9cb5cdeca397d0ad5074",
        "text": "An understanding of professional and ethical responsibility.",
        "selectedValue": 3
      },
      {
        "_id": "67fc9cb5cdeca397d0ad5075",
        "text": "An ability to communicate effectively.",
        "selectedValue": 2
      },
      {
        "_id": "67fc9cb5cdeca397d0ad5076",
        "text": "The broad education necessary to understand the impact of engineering solutions in a global, economic, environmental, and societal context.",
        "selectedValue": 1
      },
      {
        "_id": "67fc9cb5cdeca397d0ad5077",
        "text": "The recognition of the need for, and an ability to engage in life-long learning.",
        "selectedValue": 1
      },
      {
        "_id": "67fc9cb5cdeca397d0ad5078",
        "text": "The knowledge of contemporary issues.",
        "selectedValue": 5
      },
      {
        "_id": "67fc9cb5cdeca397d0ad5079",
        "text": "An ability to use the techniques, skills, and modern engineering tools necessary for engineering practice.",
        "selectedValue": 5
      }
    ],
    "postGraduationPlan": "Higher Education",
    "postGraduationPlanDetails": "MTech"
  }
  ```
  For the question : What do you plan to do after graduation at TU? -> postGraduationPlan
  and,
  For the input: fill detail -> postGraduationPlanDetails

### POST Student Feedback Form ABET

- **POST**: `/students/getFeedbackFormAbet/:studentId`
- **Request Body**:
  ```json
  {
    "levels": {
      "67fc9cb5cdeca397d0ad506f": "3", //"question's id": "level value"
      "67fc9cb5cdeca397d0ad5070": "4",
      "67fc9cb5cdeca397d0ad5071": "5",
      "67fc9cb5cdeca397d0ad5072": "5",
      "67fc9cb5cdeca397d0ad5073": "5",
      "67fc9cb5cdeca397d0ad5074": "3",
      "67fc9cb5cdeca397d0ad5075": "2",
      "67fc9cb5cdeca397d0ad5076": "1",
      "67fc9cb5cdeca397d0ad5077": "1",
      "67fc9cb5cdeca397d0ad5078": "5",
      "67fc9cb5cdeca397d0ad5079": "5"
    },
    "postGraduationPlan": "Higher Education",
    "postGraduationPlanDetails": "MTech"
  }
  ```

# Student Feedback Form

### GET Student Feedback Form

- **GET**: `/students/getFeedbackForm/:studentId`
- **Response**:
  ```json
  "studentId": "67b871b057e338fa24e3163e",
    "questions": [
        {
            "_id": "67fce0049ce7cdee2d53ec1b",  //question's id
            "text": "Overall, how would you rate the experience during 8th semester?",  //question
            "answer": "9"
        },
        {
            "_id": "67fce0049ce7cdee2d53ec1c",
            "text": "Would you like to recommend for having full alternate semester instead of industrial exposure in the last semester/project semester?",
            "answer": "Yes"
        },
        {
            "_id": "67fce0049ce7cdee2d53ec1d",
            "text": "Rate the importance of project semester in the graduate curriculum",
            "answer": "5"
        },
        // This question's answer's type -> Object therefore while sending it's answer to the backend it has a different payload
        // It will be clear after refering [*1*] below
        {
            "_id": "67fce0049ce7cdee2d53ec29",
            "text": "If you think that CSED, TU may have some collaboration with your organization, then please suggest some personnel to whom the department may contact",
            "answer": {
                "name": "David",
                "designation": "Manager",
                "email": "davidoffical@gmail.com",
                "phone": "9708657831"
            }
        }
    ]
  ```

### Post Student Feedback Form

- **POST**: `/students/submitFeedbackForm/:studentId`
- **Request Body**:

  ```json
  {
    "answers": {
      "67fce0049ce7cdee2d53ec1b": "9", //"question id": "answer"
      "67fce0049ce7cdee2d53ec1c": "Yes",
      "67fce0049ce7cdee2d53ec1d": "5",
      "67fce0049ce7cdee2d53ec1e": "7",
      "67fce0049ce7cdee2d53ec1f": "10",
      "67fce0049ce7cdee2d53ec20": "9",
      "67fce0049ce7cdee2d53ec21": "7",
      "67fce0049ce7cdee2d53ec22": "8",
      "67fce0049ce7cdee2d53ec23": "9",
      "67fce0049ce7cdee2d53ec24": "Only Meals are arranged/provided by the organization",
      "67fce0049ce7cdee2d53ec25": "5000-7000",
      "67fce0049ce7cdee2d53ec26": "Company has arranged this for me but paid by me",
      "67fce0049ce7cdee2d53ec27": "Yes",
      "67fce0049ce7cdee2d53ec28": "Yes",
      "67fce0049ce7cdee2d53ec2a": "Two times visit must be there",
      "67fce0049ce7cdee2d53ec2b": "Data Structures and Algorithms, Much More",
      "67fce0049ce7cdee2d53ec2c": "System Design",
      "67fce0049ce7cdee2d53ec2d": "Excellent",
      "67fce0049ce7cdee2d53ec2e": "Excellent",
      "67fce0049ce7cdee2d53ec2f": "Excellent",
      "67fce0049ce7cdee2d53ec30": "Nope"
    },
    //[*1*] : for the mentioned question, send the questionid and the answer inside collabContact
    "collabContact": {
      "question": "67fce0049ce7cdee2d53ec29",
      "answer": {
        "name": "David",
        "designation": "Manager",
        "email": "davidoffical@gmail.com",
        "phone": "9708657831"
      }
    }
  }
  ```

# Student Future Plan

### Get Future Plan

- **GET**: `/students/getFuturePlan/:studentId`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Future plan retrieved successfully",
    "futurePlan": "off-campus placement",
    "details": {
      "companyName": "Microsoft",
      "job": "Software Engineer",
      "profile": "cool",
      "position": "Junior Developer",
      "ctc": "20LPA",
      "city": "Hydereabad",
      "country": "India"
    }
  }
  ```

### Submit Future Plan

- **POST**: `/students/submitFuturePlan/:studentId`
- **Request Body**:
  ```json
  {
    "futurePlan": "on-campus placement",
    "futurePlanDetails": {
      "companyName": "Google",
      "job": "Software Engineer",
      "profile": "cool",
      "position": "Junior Developer",
      "ctc": "30LPA",
      "city": "Hydereabad",
      "country": "India"
    }
  }
  ```








# Student Overall Progress

### Get Student Overall Progress
- **GET**: `/students/getOverallProgress/:studentId`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Overall progress retrieved successfully",
    "studentId": "67b871b057e338fa24e3163e",
    "overallProgress": {
        "goalReportUploaded": "Pending",
        "midWayReportUploaded": "Pending",
        "projectPresentationUploaded": "Pending",
        "projectReportFileUploaded": "Pending",
        "stuInputFormFilledByStudent": "Pending",
        "fortnightlyReportByStudent": "Pending",
        "fortnightlyReportByFacultyMentor": "Pending",
        "commentsGivenByFacultyCoordinator": "Pending",
        "facultyGivenMarksForGoalReport": "Pending",
        "facultyGivenMarksForMidwayReport": "Pending",
        "industrialMentorFilledAssignmentDetails": "Pending",
        "industrialMentorGivenMarks": "Pending",
        "feedbackFormByStudent": "Pending",
        "feedbackFormAbetStudent": "Pending",
        "feedbackFormAbetIndustrialMentor": "Pending",
        "futurePlans": "Pending"
    } 
  }
  ```
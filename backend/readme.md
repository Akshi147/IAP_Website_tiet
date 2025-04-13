# ABET Form API Documentation

## Get ABET Form for Mentor

### Endpoint
**GET**: `http://localhost:4000/mentors/getAbetForm/{mentorId}`

### Headers
- **Authorization**: Bearer `<auth_token>`

### Parameters
- **mentorId**: The unique ID of the mentor for whom the ABET form is being requested.

### Response
The API will return a JSON object with the following structure:

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
        {
            "_id": "67fb8c3b6b5f9d676e263e79",
            "text": "TIET CSE students have an ability to design and conduct experiments, as well as to analyze and interpret data.",
            "selectedValue": null
        },
        {
            "_id": "67fb8c3b6b5f9d676e263e7a",
            "text": "TIET CSE students have an ability to design a system, component, or process to meet desired needs.",
            "selectedValue": null
        },
        {
            "_id": "67fb8c3b6b5f9d676e263e7b",
            "text": "TIET CSE students have an ability to function on multidisciplinary teams.",
            "selectedValue": null
        },
        {
            "_id": "67fb8c3b6b5f9d676e263e7c",
            "text": "TIET CSE students have an ability to identify, formulate, and solve engineering problems.",
            "selectedValue": null
        },
        {
            "_id": "67fb8c3b6b5f9d676e263e7d",
            "text": "TIET CSE students have an understanding of professional and ethical responsibility.",
            "selectedValue": null
        },
        {
            "_id": "67fb8c3b6b5f9d676e263e7e",
            "text": "TIET CSE students have an ability to communicate effectively.",
            "selectedValue": null
        },
        {
            "_id": "67fb8c3b6b5f9d676e263e7f",
            "text": "TIET CSE students have the broad education necessary to understand the impact of engineering solutions in a global, economic, environmental, and societal context.",
            "selectedValue": null
        },
        {
            "_id": "67fb8c3b6b5f9d676e263e80",
            "text": "TIET CSE students have a recognition of the need for, and an ability to engage in life-long learning.",
            "selectedValue": null
        },
        {
            "_id": "67fb8c3b6b5f9d676e263e81",
            "text": "TIET CSE students have a knowledge of contemporary issues.",
            "selectedValue": null
        },
        {
            "_id": "67fb8c3b6b5f9d676e263e82",
            "text": "TIET CSE students have an ability to use the techniques, skills, and modern engineering tools necessary for engineering practice.",
            "selectedValue": null
        }
    ]
}




Submit ABET Form for Mentor
Endpoint
POST: http://localhost:4000/mentors/submitAbetForm/{mentorId}

Headers
Authorization: Bearer <auth_token>
Content-Type: application/json
Parameters
mentorId: The unique ID of the mentor for whom the ABET form is being submitted.
Request Body
The request body should contain the following fields:

{
    "levels": {
        "661a1e23abcd12345678ef90": 4,
        "661a1e23abcd12345678ef91": 5,
        "661a1e23abcd12345678ef92": 3
    },
    "suggestedCourse": "Cloud Computing",
    "overallSatisfaction": "Excellent"
}

the response will come like this 

{
    "message": "Feedback submitted successfully",
    "feedback": {
        "_id": "67fb8eaf8412a5b3232b4383",
        "mentor": "67b85e615d284f70594721d6",
        "__v": 0,
        "createdAt": "2025-04-13T10:15:11.956Z",
        "overallSatisfaction": "Excellent",
        "responses": [
            {
                "question": "661a1e23abcd12345678ef90",
                "levelOfAttainment": 4,
                "_id": "67fb8eaf78cb367d76c39450"
            },
            {
                "question": "661a1e23abcd12345678ef91",
                "levelOfAttainment": 5,
                "_id": "67fb8eaf78cb367d76c39451"
            },
            {
                "question": "661a1e23abcd12345678ef92",
                "levelOfAttainment": 3,
                "_id": "67fb8eaf78cb367d76c39452"
            }
        ],
        "suggestedCourse": "Cloud Computing",
        "updatedAt": "2025-04-13T10:15:11.956Z"
    }
}



breif progress report form in mentor,
to get details send get request to:
http://localhost:4000/mentors/breifProgressReport/:studentId

response should look like this if report is filled by industrial mentor
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
            "assignment1Details": "Build frontend",
            "assignment1Status": "On Going",
            "assignment2Details": "Setup backend",
            "assignment2Status": "Pending",
            "assignment3Details": "Deploy to server",
            "assignment3Status": "Choose One...",
            "hrName": "John Doe",
            "hrContactNumber": "9876543210",
            "hrEmailId": "john.doe@example.com",
            "remarksByIndustryCoordinator": "Good progress so far.",
            "__v": 0
        }
    }
}

to send post request to to submit breief report of mentor
send post request to http://localhost:4000/mentors/submitBriefProgressReport/:studentID
with the payload :
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

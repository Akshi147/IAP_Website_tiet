# IAP Website TIET

## Register Payload

```json
{



    "email":"somename@thapar.edu",
    "name":"Some Poudel",
    "phoneNumber":"9812334466",
    "rollNo":"102317651",
    "semesterType":"Project Semester",
    "classSubgroup":"2q12",
    "password":"passwordokkk",
    "branch":"COPC",
    "trainingArrangedBy":"Some name",
    "companyName":"Some Name",
    "companyCity":"Some Name"

}
```

## Login Payload

```json
{
    "rollNo": "1****2",
    "password": "password***"
}
```

## Endpoints

- To get profile, go to: `/students/profile`
- To logout, go to: `/students/logout`
- To upload a document, go to: `/students/uploadfile` and upload the file as `file`
- To download the training letter , goto : `students/downloadfile/trainingletter`




## Faculty Resistration
```json
{
    "intial": "Mr",
    "name": "John Doe",
    "designation": "Professor",
    "department": "Computer Engineering",
    "contactNo": "9106781890",
    "email": "someemail@thapar.edu",
    "password": "password"
}
```

## Faculty Login
```json
{
    "email": "someemail@thapar.edu",
    "password": "password"
}
```


## Faculty Endpoints
- To register, go to: `/faculty/register`
- To login, go to: `/faculty/login`
- To logout, go to: `/faculty/logout`




## Mentor Endpoints and payload

### Mentor Registration Payload
```json
{
    "email": "xyz@gmail.com"
}
```

### Mentor Set Password For Registration Payload
```json
{
    "password": "***123"
}
```

### Mentor Login Payload
```json
{
    "email": "xyz@gmail.com",
    "password": "***123"
}
```


### Mentor Endpoints
- To register mentor, go to: `/mentors/register`
- To login mentor, go to: `/mentors/login`
- To logout mentor, go to: `/mentors/logout`
- For passsword and info setup, and email verification at once: `mentors/setPassword/token`
- To get assigned students, go to: `mentors/getAssignedStudents`
<!-- - For setting mentor details, go to: `mentors/setDetails` -->


### Registration Workflow
1. **Mentor email is submitted.**
    - **Mentor exists**
        - Email sent for password setup and email verification
        - Set Password link directing to the frontend: `http://localhost:5173/mentor/setPassword?token=${token}` 
    - **Mentor doesn't exist** 
        - Show error

2. **Mentor enters password**  
   - **Details:**  
     - **Payload for setting password and other info:**  
       ```json
       {
           "name": "Mentor's name",
           "designation": "Mentor's designation",
           "contact": "97********",
           "password": "***123"
       }
       ```
     - **Route for setting password:** `mentors/setPassword/token`  
     - **Mentor set password successful**  


3. **Mentor goes to login**
    - **Route for login:** `/mentors/login`
    - **Payload for login**
    ```json
    {
        "email": "xyz@gmail.com",
        "password": "***123"
    }
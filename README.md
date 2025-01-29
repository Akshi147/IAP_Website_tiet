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
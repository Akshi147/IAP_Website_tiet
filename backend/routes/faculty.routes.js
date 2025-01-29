const express = require('express');
const router = express.Router();

const { body } = require("express-validator");

const facultyController = require("../controllers/faculty.controller");

router.post("/register", [
    body("initial")
        .notEmpty().withMessage("Please select an initial"),
    body("name")
        .isLength({ min: 3 }).withMessage("Name must be at least 3 characters long")
        .matches(/^[A-Za-z\s]+$/).withMessage("Name must only contain alphabets and spaces"),
    body("designation")
        .notEmpty().withMessage("Please select a designation"),
    body("department")
        .notEmpty().withMessage("Please select a department"),
    body("contactNo")
        .matches(/^[0-9]{10}$/).withMessage("Contact number must be a valid 10-digit number"),
    body("email")
        .isEmail().withMessage("Please enter a valid email"),
    body("password")
        .isLength({min: 3}).withMessage("Password must be atleast 3 characters long")
], facultyController.registerFaculty);


router.post("/login", [
    body("email")
        .isEmail().withMessage("Please enter a valid email"),
    body("password")
    .isLength({min:3}).withMessage("Password must be atleast 3 characters long")
], facultyController.loginFaculty);


module.exports = router;
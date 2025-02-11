const express = require('express');
const router = express.Router();
const {body} = require("express-validator");
const mentorController = require("../controllers/mentor.controller");
const {authMentor} = require("../middlewares/auth.middleware");
const crypto = require("crypto");

console.log(mentorController);
console.log(authMentor);

router.post("/register", [
    body("email")
        .isEmail()
        .withMessage("Please enter a valid email")
], mentorController.registerMentor);


router.post("/login", [
    body("email")
        .isEmail()
        .withMessage("Please enter a valid email"),
    body("password")
        .isLength({min: 3})
        .withMessage("Password must be atleast 3 characters long")
], mentorController.loginMentor);


router.get("/logout", authMentor, mentorController.logoutMentor);

router.get("/assignedStudents", authMentor, mentorController.getAssignedStudents);

router.post("/setPassword/:param", mentorController.setPassword);

router.post("/forgotpassword", mentorController.forgotPassword);

router.post("/resetpassword", mentorController.resetPassword);

module.exports = router;
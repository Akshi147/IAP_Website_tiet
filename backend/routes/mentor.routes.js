const express = require('express');
const router = express.Router();
const {body} = require("express-validator");
const mentorController = require("../controllers/mentor.controller");
const {authMentor} = require("../middlewares/auth.middleware");
const crypto = require("crypto");


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

router.get("/getAssignedStudents", authMentor, mentorController.getAssignedStudents);

router.post("/setPassword/:param", mentorController.setPassword);

router.post("/forgotpassword", mentorController.forgotPassword);

router.post("/resetpassword", mentorController.resetPassword);

router.get("/getAbetForm/:mentorId", authMentor, mentorController.getAbetForm);
router.post("/submitAbetForm/:mentorId", authMentor, mentorController.submitAbetForm);

// router.post('/setDetails', authMentor, mentorController.setMentorDetails);

router.get("/getFeedbackForm/:mentorId", authMentor, mentorController.getFeedBackForm);
router.post ("/submitFeedbackForm/:mentorId", authMentor, mentorController.submitFeedBackForm);


router.get("/breifProgressReport/:studentId", mentorController.getBriefProgressReport);
router.post("/submitBriefProgressReport/:studentId", mentorController.submitBriefProgressReport);
module.exports = router;
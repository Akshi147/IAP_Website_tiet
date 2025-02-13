const express = require('express');
const router = express.Router();
const {body} = require("express-validator");
const mentorController = require("../controllers/mentor.controller");
const {authMentor} = require("../middlewares/auth.middleware");
const crypto = require("crypto");
const mentorModel = require("../models/mentor.model");

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

router.get("/getAssignedStudents", authMentor, mentorController.getAssignedStudents);

router.get("/checkToken/:token", mentorController.checkToken);

router.post("/setPassword", [
    body("password").notEmpty().withMessage("Password is required."),
],authMentor, mentorController.setPassword);


router.post("/forgotpassword", mentorController.forgotPassword);

router.post("/resetpassword", mentorController.resetPassword);

router.get("/profile", authMentor, async (req, res) => {
    try {
        console.log("📌 Mentor ID from Tokensssss:", req.mentor._id);

        const mentor = await mentorModel.findById(req.mentor._id);

        if (!mentor) {
            return res.status(404).json({
                success: false,
                message: "Mentor not found",
            });
        }

        res.status(200).json({
            success: true,
            mentor: {
                email: mentor.email,
                name: mentor.name,
                designation: mentor.designation,
            }
        });

    } catch (error) {
        console.error("❌ Error fetching mentor profile:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});





// router.post('/setDetails', authMentor, mentorController.setMentorDetails);

module.exports = router;
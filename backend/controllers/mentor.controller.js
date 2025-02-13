const mentorModel = require('../models/mentor.model');
const studentModel = require("../models/student.model");
const { validationResult } = require('express-validator');
const blacklistModel = require('../models/blacklist.model');
const jwt = require('jsonwebtoken')
const crypto = require("crypto");
const sendEmail = require('../libs/nodemailer');



// Register Mentor (Only Email Submission)

module.exports.registerMentor = async (req, res) => {
    try {
        const mentorEmail = req.body.email.trim().toLowerCase();
        const mentorStudentEntry = await studentModel.findOne({ mentorEmail });

        if (!mentorStudentEntry) {
            return res.status(404).json({ success: false, message: "Mentor not found." });
        }

        let existingMentor = await mentorModel.findOne({ email: mentorEmail });

        if (existingMentor && existingMentor.verified) {
            return res.status(400).json({ success: false, message: "Mentor already registered. Kindly log in." });
        }

        // ✅ Generate resetToken before using it
        const resetToken = crypto.randomBytes(32).toString("hex");  
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        // Save reset token in mentor model
        if (!existingMentor) {
            existingMentor = new mentorModel({ email: mentorEmail });
        }

        existingMentor.resetPasswordToken = hashedToken;
        existingMentor.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // Expires in 1 hour

        await existingMentor.save();


        // ✅ Use resetToken in email instead of undefined "token"
        await sendEmail(mentorEmail, "Set up your password", `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f8f8f8;
                    }
                    .container {
                        width: 100%;
                        text-align: center;
                        padding: 20px;
                    }
                    .content {
                        background-color: white;
                        padding: 40px;
                        margin: 20px auto;
                        max-width: 600px;
                        border-radius: 10px;
                        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                        text-align: left;
                    }
                    .title {
                        font-size: 22px;
                        font-weight: bold;
                        color: #2b2b2b;
                        text-align: center;
                    }
                    .message {
                        font-size: 16px;
                        color: #4d4d4d;
                        margin-top: 10px;
                    }
                    .button {
                        display: inline-block;
                        margin-top: 20px;
                        padding: 12px 24px;
                        background-color: #b46dd3;
                        color: white;
                        text-decoration: none;
                        font-size: 16px;
                        border-radius: 5px;
                        font-weight: bold;
                        text-align: center;
                    }
                    .footer {
                        margin-top: 20px;
                        font-size: 14px;
                        color: #777;
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <!-- University Header with Table -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #b46dd3; color: white; text-align: center;">
                        <tr>
                            <td style="padding: 20px; font-size: 24px; font-weight: bold;">IAP CELL</td>
                        </tr>
                        <tr>
                            <td style="font-size: 16px;">THAPAR INSTITUTE OF ENGINEERING AND TECHNOLOGY, PATIALA</td>
                        </tr>
                        <tr>
                            <td style="font-size: 16px;">(DEEMED TO BE UNIVERSITY)</td>
                        </tr>
                    </table>

                    <div class="content">
                        <div class="title">6 MONTH PROJECT SEMESTER</div>
                        <p class="message">Respected Sir/Madam</p>
                        <p class="message">Please set up you password by cicking the link below:</p>
                        

                        <div style="text-align: center;">
                            <a href="http://localhost:5173/mentors/setPassword?token=${hashedToken}" class="button">Set password</a>
                        </div>
                    </div>
                </div>
            </body>
            </html>
            `);

        res.status(201).json({ success: true, message: "Verification email sent.",hashedToken});

    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

module.exports.setPassword = async (req, res) => {

    console.log(req.mentor);
    try {
        const {_id}=req.mentor;
        const { password, name, designation, contact } = req.body;


        // Find mentor using reset token
        const mentor = await mentorModel.findOne({
            _id,
        });

        if (!mentor) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired token."
            });
        }

        // ✅ Update mentor details
        mentor.password = await mentorModel.hashPassword(password);
        mentor.name = name;
        mentor.designation = designation;
        mentor.contact = contact;
        mentor.verified = true; // ✅ Mark mentor as verified
        mentor.resetPasswordToken = null;
        mentor.resetPasswordExpires = null;

        await mentor.save();

        res.status(200).json({
            success: true,
            message: "Registration completed successfully. You can now log in."
        });
    } catch (err) {
        console.error("Error in setPassword:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};




module.exports.checkToken = async (req, res) => {
    const { token } = req.params;
    
    try {
        console.log("Checking token:", token);

        // 🔹 Find the mentor with this hashed token
        const mentor = await mentorModel.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

        if (!mentor) {
            console.error("Token not found:", token);
            return res.status(400).json({ success: false, message: "Invalid or expired token." });
        }
        const createtoken = mentor.generateAuthToken();
        res.status(200).json({ success: true, message: "Token is valid",token:createtoken });
    } catch (error) {
        console.error("❌ Error in checkToken:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

module.exports.loginMentor = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const mentor = await mentorModel.findOne({ email: req.body.email }).select('+password');

        if (!mentor) {
            return res.status(400).json({ 
                success: false,
                message: "Mentor not found" 
            });
        }

        if (!mentor.verified) {
            return res.status(403).json({
                success: false,
                message: "Account not verified. Please check your email to set up your password."
            });
        }

        const validPassword = await mentor.comparePassword(req.body.password);
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid Password"
            });
        }

        const token = mentor.generateAuthToken();
        res.cookie("token", token, { httpOnly: true, secure: false });

        res.status(200).json({
            success: true,
            message: "Mentor logged in successfully",
            token
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};




module.exports.logoutMentor = async(req, res) => {
    res.clearCookie("token");
    
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];
    await blacklistModel.create({token});

    res.status(200).json({message:'Logged out successfully'});
}

// module.exports.setMentorDetails = async(req, res) => {
//     try{
//         const {name, designation, contact} = req.body;
//         const mentor = await mentorModel.findById(req.mentor._id);

//         mentor.name = name;
//         mentor.designation = designation;
//         mentor.contact = contact;

//         await mentor.save();

//         res.status(200).json({
//             success: true,
//             message: "Mentor Details Set Successfully"
//         })
//     }catch(err){
//         res.status(500).json({
//             success: false,
//             message: err.error
//         })
//     }
// }


module.exports.forgotPassword = async(req, res) => {
    try{
        const {email} = req.body;
        const mentor = await mentorModel.findOne({email});
        console.log(mentor);

        if(!mentor){
            return res.status(404).json({
                success: false,
                message: "Mentor not found" 
            });
        }

        const resetToken = mentor.generateResetToken();
        await mentor.save();


        const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

        await sendEmail(mentor.email, "Reset your password", `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            width: 100%;
            padding: 20px;
            text-align: center;
        }
        .email-content {
            background-color: #ffffff;
            padding: 30px;
            max-width: 600px;
            margin: 20px auto;
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            text-align: left;
        }
        .header {
            background-color: #6c63ff;
            color: #ffffff;
            padding: 15px;
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .message {
            font-size: 16px;
            line-height: 1.6;
            margin-top: 10px;
        }
        .button {
            display: inline-block;
            background-color: #6c63ff;
            color: white;
            padding: 12px 20px;
            text-decoration: none;
            font-size: 16px;
            font-weight: bold;
            border-radius: 5px;
            margin-top: 20px;
            text-align: center;
        }
        .button:hover {
            background-color: #5a54e3;
        }
        .footer {
            font-size: 14px;
            color: #777;
            margin-top: 20px;
            text-align: center;
        }
        @media screen and (max-width: 600px) {
            .email-content {
                padding: 20px;
            }
        }
    </style>
</head>
<body>

    <div class="container">
        <div class="email-content">
            <div class="header">Password Reset Request</div>

            <p class="message">Dear <b>${mentor.name}</b>,</p>
            <p class="message">
                We received a request to reset your password. If this was you, please click the button below to set a new password. 
                This link will expire in 1 hour for security reasons.
            </p>

            <div style="text-align: center;">
                <a href="${resetLink}" class="button">Reset My Password</a>
            </div>

            <p class="message">
                If you did not request a password reset, please ignore this email. Your account remains secure.
            </p>

            <p class="footer">If you need further assistance, please contact our support team.</p>
        </div>
    </div>

</body>
</html>
        `);

        res.status(200).json({
            success: true,
            message: "Password reset link sent to your email. Please Check Spam Folder too",
            resetToken
        });
    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


module.exports.resetPassword = async(req, res) => {
    try{
        const { token, newPassword } = req.body;
        
        // Hash the token to find in DB
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const mentor = await mentorModel.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }, // Check expiration
        });

        if (!mentor) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired token" 
            });
        }

        // Hash new password and save
        mentor.password = await mentorModel.hashPassword(newPassword);
        mentor.resetPasswordToken = null;
        mentor.resetPasswordExpires = null;

        await mentor.save();

        res.status(200).json({ 
            success: true,
            message: "Password successfully reset!" 
        });
    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

module.exports.getAssignedStudents = async (req, res) => {
    try {
      const mentor = await mentorModel.findById(req.mentor._id);
      if (!mentor) {
        return res.status(404).json({ success: false, message: "Mentor not found" });
      }
  
      const studentsAssigned = await studentModel.find({ mentorEmail: mentor.email });
  
      if (!studentsAssigned.length) {
        return res.status(404).json({ success: false, message: "No students assigned" });
      }
  
      res.status(200).json({ success: true, students: studentsAssigned });
    } catch (error) {
      console.error("Error fetching assigned students:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  


module.exports.getMentorProfile = async (req, res) => {
    try {
      const mentor = await mentorModel.findById(req.mentor._id);
      if (!mentor) {
        return res.status(404).json({ success: false, message: "Mentor not found" });
      }
  
      res.status(200).json({ success: true, mentor });
    } catch (error) {
      console.error("Error fetching mentor profile:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  

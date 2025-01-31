const blacklistModel = require("../models/blacklist.model");
const facultyModel = require("../models/faculty.model");
const { validationResult } = require("express-validator");
const jwt = require('jsonwebtoken')
const sendEmail = require('../libs/nodemailer')


module.exports.registerFaculty = async (req, res) => {
    try{
        //validation
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        //checking if faculty getting registered already exists 
        const facultyExists = await facultyModel.findOne({
            email: req.body.email
        });

        //faculty exists
        if(facultyExists){
            return res.status(400).json({
                success: false,
                message: "Faculty already exists"
            })
        }

        //faculty doesn't exists
        const hashedPassword = await facultyModel.hashPassword(req.body.password);

        const faculty = new facultyModel({
            initial: req.body.initial,
            name: req.body.name,
            designation: req.body.designation,
            department: req.body.department,
            contactNo: req.body.contactNo,
            email: req.body.email,
            password: hashedPassword  
        });

        await faculty.save();
        const token = faculty.generateAuthToken();
        res.cookie("token", token);
        await sendEmail(faculty.email, 'Verify Your Faculty Account', `
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
                        <div class="title">Faculty Account Verification</div>
                        <p class="message">
                            Dear <b>${faculty.initial} ${faculty.name}</b>,
                        </p>
                        <p class="message">
                            Welcome to the Faculty Management System. Your account has been successfully created. Please find your details below:
                        </p>
            
                        <p><b>Designation:</b> ${faculty.designation}</p>
                        <p><b>Department:</b> ${faculty.department}</p>
                        <p><b>Email:</b> ${faculty.email}</p>
                        <p><b>Contact No:</b> ${faculty.contactNo}</p>
            
                        <p class="message">Please verify your email address to activate your faculty account.</p>
            
                        <div style="text-align: center;">
                            <a href="http://localhost:4000/faculty/verifyFaculty/${token}" class="button">Verify Email</a>
                        </div>
            
                        <p class="footer">If you did not sign up for this, you can ignore this email.</p>
                    </div>
                </div>
            </body>
            </html>
            `);
            

        res.status(201).json({
            success: true,
            message: "Faculty has registered successfully",
            faculty,
            token
        });
    }catch(err){
        res.status(500).json({
            success: false,
            error: err.message
        })
    }
}



module.exports.loginFaculty = async (req, res) => {
    try{
        //validation
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const faculty = await facultyModel.findOne({
            email: req.body.email
        }).select("+password");

        //faculty doesn't exists
        if(!faculty){
            return res.status(400).json({
                success: false,
                message: "Faculty not found",
            })
        }

        //faculty exists in DB
        const validPassword = await faculty.comparePassword(req.body.password);
        
        if(!validPassword){
             return res.status(400).json({
                success: false,
                message: "Invalid password"
            })
        }

        const token = faculty.generateAuthToken();
        res.cookie("token", token);

        res.status(200).json({
            success: true,
            message: "Faculty has logged in successfully",
            token
        })
    }catch(err){
        res.status(500).json({
            success: false,
            error: err.message
        })
    }
}


module.exports.logoutFaculty = async (req, res) => {
    res.clearCookie("token");

    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    await blacklistModel.create({token});

    res.status(200).json({
        success: true,
        message: "Succcessfully logged out"
    })
}

module.exports.getFacultyProfile = async (req, res) => {
    try {
        const faculty = req.faculty;
        if (!faculty) {
            return res.status(404).json({
                success: false,
                message: "Faculty not found"
            });
        }
        console.log(faculty);
        res.status(200).json({ faculty });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports.verifyFaculty = async (req, res) => {
    try {
        const token = req.params.param.trim(); 
        if(!token){
            return res.status(400).json({
                success: false,
                message: "Invalid token"
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded._id) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        const faculty = await facultyModel.findById(decoded._id);
        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }
        faculty.emailverified = true;
        await faculty.save();
        res.status(200).json({ message: 'Faculty verified successfully', faculty });

    } catch (error) {
        console.error("JWT Verification Error:", error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        res.status(500).json({ error: error.message });
    }
};
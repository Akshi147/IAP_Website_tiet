const studentModel = require('../models/student.model');
const { validationResult } = require('express-validator');
const blacklistModel = require('../models/blacklist.model');
const jwt = require('jsonwebtoken')
const sendEmail = require('../libs/nodemailer')


module.exports.registerStudent = async (req, res) => {
    try {
        console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const studentExists = await studentModel.findOne({ email: req.body.email });
        if (studentExists) {
            return res.status(400).json({ message: 'Student already exists' });
        }
        const hashPassword = await studentModel.hashPassword(req.body.password);

        const student = new studentModel({
            name: req.body.name,
            email: req.body.email,
            password: hashPassword,
            phoneNumber: req.body.phoneNumber,
            rollNo: req.body.rollNo,
            semesterType: req.body.semesterType,
            classSubgroup: req.body.classSubgroup,
            branch: req.body.branch,
            trainingArrangedBy: req.body.trainingArrangedBy,
            companyDetails: {
                companyName: req.body.companyName,
                companyCity: req.body.companyCity,
            },
        });
        await student.save();
        const token = student.generateAuthToken();
        res.cookie('token',token);
        await sendEmail(student.email, 'Verify Yourself', `<!DOCTYPE html>
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
            <p class="message">Dear <b>${student.name}</b>,</p>
            <p class="message">Welcome to the online module for evaluation. Please find your details below:</p>

            <p><b>Roll No:</b> ${student.rollNo}</p>
            <p><b>Branch:</b> ${student.branch}</p>
            <p><b>Semester:</b> ${student.semesterType}</p>
            <p><b>Class Subgroup:</b> ${student.classSubgroup}</p>
            <p><b>Training Arranged By:</b> ${student.trainingArrangedBy}</p>
            <p><b>Company Name:</b> ${student.companyDetails.companyName}</p>
            <p><b>Company City:</b> ${student.companyDetails.companyCity}</p>

            <p class="message">Please verify your email address to activate your account.</p>

            <div style="text-align: center;">
                <a href="http://localhost:4000/students/verifyStudent/${token}" class="button">Verify Email</a>
            </div>

            <p class="footer">If you did not sign up for this, you can ignore this email.</p>
        </div>
    </div>
</body>
</html>

            `);

        res.status(201).json({ message: 'Student registered successfully' ,student,token});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports.verifyStudent = async (req, res) => {
    try {
        const token = req.params.param.trim(); 
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded._id) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        const student = await studentModel.findById(decoded._id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        student.verified = true;
        await student.save();

        res.status(200).json({ message: 'Student verified successfully', student });
    } catch (error) {
        console.error("JWT Verification Error:", error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        res.status(500).json({ error: error.message });
    }
};


module.exports.loginStudent = async (req, res) => {
    try {
        console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const student = await studentModel.findOne({ rollNo: req.body.rollNo }).select('+password')
        if (!student) {
            return res.status(400).json({ message: 'Student not found' });
        }
        const validPassword = await student.comparePassword(req.body.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const token = student.generateAuthToken();
        res.cookie('token',token);
        res.status(200).json({ message: 'Student logged in successfully', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports.getStudentProfile = async (req, res) => {
    try {
        const student = req.student;
        res.status(200).json({ student });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports.logoutStudent = async (req,res)=>{
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];
    await blacklistModel.create({token});

    res.status(200).json({message:'Logged out successfully'});
}

module.exports.uploadFile = async (req,res)=>{
    if (!req.file) {
        return res.status(400).send("No files were uploaded");
      }

    const student = req.student;
    student.trainingLetter=req.file.filename;
    await student.save();
    res.status(200).json({message:'File uploaded successfully'});
};


module.exports.downloadTrainingLetter = async (req,res)=>{
    const student = req.student;
    if(!student.trainingLetter){
        return res.status(404).json({message:'File not found'});
    }
    res.download(`../backend/public/images/uploads/${student.trainingLetter}`);
};

module.exports.uploadFiles = async (req,res)=>{
    if (!req.file) {
        return res.status(400).send("No files were uploaded");
      }

    const student = req.student;
    student.feeReceipt=req.file.filename;
    await student.save();
    res.status(200).json({message:'File uploaded successfully'});
};

module.exports.verifyStudentDocument = async (req, res) => {
    try {
        const rollNo = req.params.rollNo;

        if (!rollNo) {
            return res.status(400).json({ message: "Roll number is required." });
        }

        const student = await studentModel.findOne({ rollNo });

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        if (!student.verified) {
            return res.status(400).json({ message: "Student email has not been verified." });
        }

        if (!student.feeReceipt) {
            return res.status(400).json({ message: "Fee receipt has not been uploaded by the student." });
        }

        if (!student.trainingLetter) {
            return res.status(400).json({ message: "Training letter has not been uploaded by the student." });
        }

        res.status(200).json({ student });
    } catch (error) {
        console.error("Server Error:", error.message);
        res.status(500).json({ error: "Internal server error. Please try again later." });
    }
};

const studentModel = require('../models/student.model');
const { validationResult } = require('express-validator');
const blacklistModel = require('../models/blacklist.model');
const jwt = require('jsonwebtoken')
const sendEmail = require('../libs/nodemailer')
const fs = require('fs');
const path = require('path'); // To ensure correct file path handling
const crypto = require('crypto');


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
    try {
        const filename = req.params.trainingLetter
        res.download(`../backend/public/images/uploads/${filename}`);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
   
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

module.exports.downloadFeeReceipt = async (req,res)=>{
    try {
        const filename = req.params.feeReceipt
        res.download(`../backend/public/images/uploads/${filename}`);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
   


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
const generateEmailTemplate = (student, fileType,reason,customMessage,contactPerson) => {
    const fileNames = {
        feeReceipt: "Fee Receipt",
        trainingLetter: "Training Letter"
    };

    const reuploadLinks = {
        feeReceipt: `/students/reuploadFeeReceipt/${student.rollNo}`,
        trainingLetter: `/students/reuploadTrainingLetter/${student.rollNo}`
    };

    return `
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f8f8f8; }
            .container { width: 100%; text-align: center; padding: 20px; }
            .content { background-color: white; padding: 40px; margin: 20px auto; max-width: 600px; border-radius: 10px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); text-align: left; }
            .title { font-size: 22px; font-weight: bold; color: #2b2b2b; text-align: center; }
            .message { font-size: 16px; color: #4d4d4d; margin-top: 10px; }
            .button { display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #b46dd3; color: white; text-decoration: none; font-size: 16px; border-radius: 5px; font-weight: bold; text-align: center; }
            .footer { margin-top: 20px; font-size: 14px; color: #777; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #b46dd3; color: white; text-align: center;">
                <tr><td style="padding: 20px; font-size: 24px; font-weight: bold;">IAP CELL</td></tr>
                <tr><td style="font-size: 16px;">THAPAR INSTITUTE OF ENGINEERING AND TECHNOLOGY, PATIALA</td></tr>
                <tr><td style="font-size: 16px;">(DEEMED TO BE UNIVERSITY)</td></tr>
            </table>

            <div class="content">
                <div class="title">${fileNames[fileType]} Issue - Reupload Required</div>
                <p class="message">Dear <b>${student.name}</b>,</p>
                <p class="message">We regret to inform you that your submitted ${fileNames[fileType]} has an issue and is unverified. It has been removed from our database.</p>
                <p class="message"><b>Reason:</b> Invalid or unclear ${fileNames[fileType]}.</p>
                <p class="message">Please upload a valid ${fileNames[fileType]} to complete your registration process.</p>

                <div style="text-align: center;">
                    <a href="${process.env.BASE_URL}${reuploadLinks[fileType]}" class="button">Reupload ${fileNames[fileType]}</a>
                </div>

                <p class="footer">If you believe this is a mistake, please contact the administration.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports.sendErrorEmail = async (req, res) => {
    console.log(req.body);
    try {
        const { fileType } = req.body;
        const { rollNumber } = req.params;

        if (!fileType) {
            return res.status(400).json({ message: "File type is required" });
        }

        const student = await studentModel.findOne({ rollNo: rollNumber });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        let filePath = '';
        let fileRemoved = false;

        // Remove the invalid file reference and delete the file from disk if necessary
        if (fileType === 'feeReceipt' && student.feeReceipt) {
            filePath = path.join(__dirname, '..', 'public', 'images', 'uploads', student.feeReceipt);
            student.feeReceipt = null;
            fileRemoved = true;
        } else if (fileType === 'trainingLetter' && student.trainingLetter) {
            filePath = path.join(__dirname, '..', 'public', 'images', 'uploads', student.trainingLetter);
            student.trainingLetter = null;
            fileRemoved = true;
        } else {
            return res.status(400).json({ message: "Invalid file type or no file found to remove" });
        }

        // If file was removed and exists on disk, delete it
        if (fileRemoved && fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Error deleting the file:", err);
                    return res.status(500).json({ message: "Error deleting the file from disk" });
                }
                console.log(`${fileType} file deleted successfully`);
            });
        }

        // Save the student document after updating the file field
        await student.save();

        if (!student.email) {
            return res.status(400).json({ message: "Student email not found" });
        }

        // Send email
        await sendEmail(student.email, `Your ${fileType} Has Been Rejected`,`
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f8f8f8; }
            .container { width: 100%; text-align: center; padding: 20px; }
            .content { background-color: white; padding: 40px; margin: 20px auto; max-width: 600px; border-radius: 10px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); text-align: left; }
            .title { font-size: 22px; font-weight: bold; color: #2b2b2b; text-align: center; }
            .message { font-size: 16px; color: #4d4d4d; margin-top: 10px; }
            .button { display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #b46dd3; color: white; text-decoration: none; font-size: 16px; border-radius: 5px; font-weight: bold; text-align: center; }
            .footer { margin-top: 20px; font-size: 14px; color: #777; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #b46dd3; color: white; text-align: center;">
                <tr><td style="padding: 20px; font-size: 24px; font-weight: bold;">IAP CELL</td></tr>
                <tr><td style="font-size: 16px;">THAPAR INSTITUTE OF ENGINEERING AND TECHNOLOGY, PATIALA</td></tr>
                <tr><td style="font-size: 16px;">(DEEMED TO BE UNIVERSITY)</td></tr>
            </table>

            <div class="content">
                <div class="title">${fileType} Issue - Reupload Required</div>
                <p class="message">Dear <b>${student.name}</b>,</p>
                <p class="message">We regret to inform you that your submitted ${fileType} has an issue and is unverified. It has been removed from our database.</p>
                <p class="message"><b>Reason:</b>${req.body.reason}:${req.body.customMessage} </p>
                <p class="message">Please upload a valid ${fileType} to complete your registration process.</p>
                 
                ${req.body.contactPerson ? `<p class="message">Contact Person: ${req.body.contactPerson}</p>` : ''}
                <p class="footer">If you believe this is a mistake, please contact the administration.</p>
            </div>
        </div>
    </body>
    </html>
    `);

        // ✅ Send a success response for admin logs
        res.json({
            message: `Successfully removed ${fileType} from database and emailed ${student.name} (${student.email})`,
            student: {
                name: student.name,
                rollNo: student.rollNo,
                email: student.email,
                removedFile: fileType,
            }
        });

    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
module.exports.completeVerify = async (req, res) => {
    try {
        const rollNo = req.params.rollNo;
        const updatedData = req.body; // Form data from frontend

        // Find student by rollNo
        const student = await studentModel.findOne({ rollNo });
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        // Update student fields
        Object.assign(student, updatedData, { mentorverified: true });

        // Save updated student
        await student.save();

        return res.status(200).json({
            success: true,
            message: "Student verified and updated successfully!",
            student
        });

    } catch (error) {
        console.error("❌ Verification Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
module.exports.phase3 = async (req, res) => {
    try {
        const student = req.student;
        updatedData = req.body;
        console.log(updatedData);
        Object.assign(student, updatedData, { phase3: true });
        student.stipend=updatedData.stipendPerMonth;
        student.companyDetails.companyName=updatedData.companyName;
        student.companyDetails.companyCity=updatedData.city;
        student.companyDetails.companyCountry=updatedData.country;
        student.companyDetails.completeAddress=updatedData.completeAddress;
        student.companyDetails.landmark=updatedData.landmark;
        await student.save();
        res.status(200).json({ message: 'Phase 3 completed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports.forgotPassword = async (req, res) => {
    try {
        const { rollNo } = req.body;
        const student = await studentModel.findOne({ rollNo });

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Generate reset token
        const resetToken = student.generateResetToken();
        await student.save();

        // Reset link
        const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

        // Send email
        await sendEmail(
            student.email,
            "Reset Your Password",
            `<!DOCTYPE html>
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

            <p class="message">Dear <b>${student.name}</b>,</p>
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
`
        );

        res.status(200).json({ message: "Password reset link sent to your email.Please Check Spam Folder too" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Hash the token to find in DB
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const student = await studentModel.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }, // Check expiration
        });

        if (!student) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Hash new password and save
        student.password = await studentModel.hashPassword(newPassword);
        student.resetPasswordToken = null;
        student.resetPasswordExpires = null;
        await student.save();

        res.status(200).json({ message: "Password successfully reset!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};





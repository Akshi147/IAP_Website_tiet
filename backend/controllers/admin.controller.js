const sendEmail = require('../libs/nodemailer');
const AdminModel = require('../models/admin.model');
const blacklistModel = require("../models/blacklist.model");
const studentModel = require('../models/student.model');
const StudentModel = require("../models/student.model");
const moment = require("moment");
const ExcelJS = require('exceljs');
const { query } = require('express');

module.exports.Register = async (req, res) => {
    console.log(req.body);
    try {
        const { email, password, branch } = req.body;

        // Check if the email already exists
        const admin = await AdminModel.findOne({ email });
        if (admin) {
            return res.status(400).json({
                success: false,
                message: 'Admin already exists'
            });
        }

        // Create a new admin
        const newAdmin = new AdminModel({ email, password, branch });
        await newAdmin.save();

        // Return token
        const token = newAdmin.generateAuthToken();
        res.cookie('token', token);

        res.status(200).json({
            success: true,
            message: 'Admin created successfully',
            token
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

module.exports.Login = async (req, res) => {
    try {
        const admin = await AdminModel.findOne({ email: req.body.email })
        if (!admin) {
            return res.status(400).json({
                success: false,
                message: 'Admin not found'
            });
        }

        if (admin.password !== req.body.password) {
            return res.status(400).json({
                success: false,
                message: 'Invalid password'
            });
        }

        const token = admin.generateAuthToken();
        res.cookie('token', token);

        res.status(200).json({
            success: true,
            message: 'Admin logged in successfully',
            token
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports.Logout = async (req, res) => {
    try {
        res.clearCookie('token');
        const token = req.cookies.token || req.headers.authorization.split(" ")[1];
        await blacklistModel.create({ token });

        res.status(200).json({
            success: true,
            message: 'Admin logged out successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports.GetProfile = async (req, res) => {

    try {
        const admin = req.admin;
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Admin found',
            admin
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
module.exports.ForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const admin = await AdminModel.findOne({ email });
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }
        await sendEmail(admin.email, 'Reset Password', `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Admin Account Credentials</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f8f8f8; }
        .container { width: 100%; text-align: center; padding: 20px; }
        .content { background-color: white; padding: 40px; margin: 20px auto; max-width: 600px; border-radius: 10px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); text-align: left; }
        .title { font-size: 22px; font-weight: bold; color: #2b2b2b; text-align: center; }
        .message { font-size: 16px; color: #4d4d4d; margin-top: 10px; }
        .password-box { background: #eee; padding: 10px; font-size: 18px; font-weight: bold; text-align: center; border-radius: 4px; margin: 15px 0; }
        .warning { color: red; font-weight: bold; }
        .button { display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #b46dd3; color: white; text-decoration: none; font-size: 16px; border-radius: 5px; font-weight: bold; text-align: center; }
        .footer { margin-top: 20px; font-size: 14px; color: #777; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #b46dd3; color: white; text-align: center;">
            <tr><td style="padding: 20px; font-size: 24px; font-weight: bold;">IAP CELL</td></tr>
            <tr><td style="font-size: 16px;">THAPAR INSTITUTE OF ENGINEERING AND TECHNOLOGY, PATIALA</td></tr>
            <tr><td style="font-size: 16px;">(DEEMED TO BE UNIVERSITY)</td></tr>
        </table>

        <!-- Content -->
        <div class="content">
            <div class="title">Admin Account Credentials</div>
            <p class="message">Dear Admin,</p>
            <p class="message">Your admin account password is:</p>

            <div class="password-box">
                <strong>${admin.password}</strong>
            </div>

            <p class="message warning">⚠️ For security reasons, please change your password immediately after logging in.</p>
            <p class="footer">If you didn't request this email, please contact the administration immediately.</p>
        </div>
    </div>
</body>
</html>
`);
        res.status(200).json({
            success: true,
            message: 'Password reset link sent to your email'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
module.exports.ChangePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const admin = req.admin;

        if (admin.password !== currentPassword) {
            return res.status(400).json({
                success: false,
                message: 'Invalid current password'
            });
        }
        if(admin.password === newPassword) {
            return res.status(400).json({
                success: false,
                message: 'New password cannot be the same as the current password'
            });
        }

        admin.password = newPassword;
        await admin.save();

        // Get the exact time of change in a readable format
        const changedTime = moment().format("MMMM Do YYYY, h:mm:ss A"); 

        // Email content
        const emailContent = `
            <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f8f8f8; }
                        .container { width: 100%; text-align: center; padding: 20px; }
                        .content { background-color: white; padding: 40px; margin: 20px auto; max-width: 600px; 
                                   border-radius: 10px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); text-align: left; }
                        .title { font-size: 22px; font-weight: bold; color: #2b2b2b; text-align: center; }
                        .message { font-size: 16px; color: #4d4d4d; margin-top: 10px; }
                        .footer { margin-top: 20px; font-size: 14px; color: #777; text-align: center; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #b46dd3; color: white; text-align: center;">
                            <tr><td style="padding: 20px; font-size: 24px; font-weight: bold;">Admin Panel</td></tr>
                        </table>

                        <div class="content">
                            <div class="title">Password Change Notification</div>
                            <p class="message">Dear <b>${admin.name || "Admin"}</b>,</p>
                            <p class="message">Your account password has been successfully changed.</p>
                            <p class="message"><b>Changed At:</b> ${changedTime}</p>
                            <p class="message">If you did not perform this change, please reset your password immediately.</p>
                            <p class="message">For security reasons, we recommend updating your password periodically.</p>
                            
                            <p class="footer">If you need assistance, please contact support.</p>
                        </div>
                    </div>
                </body>
            </html>
        `;

        // Send email
        await sendEmail(admin.email, 'Your Admin Password has been Changed', emailContent);

        res.status(200).json({
            success: true,
            message: 'Password changed successfully, and email notification sent.'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
module.exports.UnderDocumentVerification = async (req, res) => {
    try {
        const students = await StudentModel.find({ mentorverified: false,verified:true,trainingLetter: { $ne: null }, feeReceipt: { $ne: null } });
        res.status(200).json({
            success: true,
            students
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
module.exports.UnderPhase2Verification = async (req, res) => {
    try {
        const students = await StudentModel.find({ phase3: true, phase3verified: false });
        res.status(200).json({
            success: true,
            students
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
module.exports.VerifyPhase2 = async (req, res) => {
    try {
        const student = await studentModel.findOne({ rollNo: req.params.rollNo });
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        student.phase3verified = true;
        await student.save();
        res.status(200).json({
            success: true,
            message: 'Student verified successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
module.exports.UnlockPhase2 = async (req, res) => {
    try {
        const student = await studentModel.findOne({ rollNo: req.params.rollNo });
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        student.phase3 = false;
        await student.save();
        res.status(200).json({
            success: true,
            message: 'Student unlocked successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }

};
module.exports.GetDeleteStudent = async (req, res) => {
    try {
        const student = await studentModel.findOne({ rollNo: req.params.rollNumber });
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        res.status(200).json({
            success: true,
            student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports.DeleteStudent = async (req, res) => {
    try {
        const student = await studentModel.findOneAndDelete({ rollNo: req.params.rollNumber });
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting student:', error); // For debugging
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};


module.exports.generateExcelReport = async (req, res) => {
    try {
        console.log(req.body);
        const { year, branch, semester, faculty,semesterType } = req.body;
        const reportNumber = parseInt(req.params.reportNumber);

        // Validate report number
        if (isNaN(reportNumber) || reportNumber < 1 || reportNumber > 9) {
            return res.status(400).json({ message: 'Invalid report number' });
        }

        // Convert year to date range
        const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
        const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);

        // Construct base filter
        const filter = { createdAt: { $gte: startOfYear, $lte: endOfYear } };
        if (branch && branch !== 'ALL') filter.branch = branch;
        if (semester && semester !== 'ALL') filter.semesterType = semester;

        // Modify filter based on report type
        switch (reportNumber) {
            case 2:
                filter.mentorverified = true;
                break;
            case 3:
                filter.mentorverified = false;
                break;
            case 4:
                filter.semesterType = 'Alternate Semester';
                break;
            case 5:
                filter.internshipType = 'PROJECT';
                break;
            case 6:
                filter.stipend = { $exists: true, $ne: null };
                break;
            case 7:
                if (!faculty) {
                    return res.status(400).json({ message: 'Faculty email is required for this report' });
                }
                filter.assignedFaculty = faculty;
                break;
            case 8:
                filter.phase2Status = 'COMPLETE';
                break;
            case 9:
                filter.phase2Status = 'PENDING';
                break;
        }

        // Define selected fields for each report type
        let selectFields = 'rollNo name email phoneNumber';
        if (reportNumber === 1) {
            selectFields += ' branch semesterType classSubgroup trainingArrangedBy companyDetails.companyName companyDetails.companyCity';
        }
        if (reportNumber === 7) {
            selectFields += ' stipend';
        }

        // Fetch students data
        const students = await StudentModel.find(filter).select(selectFields);

        // Create Excel workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Students');

        // Define headers dynamically
        const headers = ['Roll No', 'Name', 'Email', 'Phone Number'];
        if (reportNumber === 1) {
            headers.push('Branch', 'Semester Type', 'Class Subgroup', 'Training Arranged By', 'Company Name', 'Company City');
        }
        if (reportNumber === 7) {
            headers.push('Stipend Amount');
        }

        // Add headers to worksheet
        worksheet.addRow(headers);

        // Add student data
        students.forEach(student => {
            const row = [
                student.rollNo,
                student.name,
                student.email,
                student.phoneNumber
            ];
            if (reportNumber === 1) {
                row.push(
                    student.branch,
                    student.semesterType,
                    student.classSubgroup,
                    student.trainingArrangedBy,
                    student.companyDetails?.companyName || 'N/A',
                    student.companyDetails?.companyCity || 'N/A'
                );
            }
            if (reportNumber === 7) {
                row.push(student.stipend || 'N/A');
            }
            worksheet.addRow(row);
        });

        // Set response headers
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=Report_${reportNumber}.xlsx`
        );

        // Send Excel file
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: 'Failed to generate report' });
    }
};



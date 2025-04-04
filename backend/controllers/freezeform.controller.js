const Fortnightly = require('../models/fortnightly.model');
const Student = require('../models/student.model');

module.exports.submitFortnightlyReport = async (req, res) => {
    try {
        const studentId = req.student._id;
        const { period } = req.params;
        const { report } = req.body;

        const fortnightly = await Fortnightly.findOne({ studentId });

        if (!fortnightly) {
            return res.status(404).json({ message: 'No reports found' });
        }

        // Check if the report is unlocked
        if (!fortnightly.reports.get(period)?.isUnlocked) {
            return res.status(403).json({ message: 'This period is locked' });
        }

        // Update the report
        fortnightly.reports.set(period, { report, isUnlocked: false });
        await fortnightly.save();

        res.json({ message: 'Report updated successfully', fortnightly });
    } catch (error) {
        
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports.getFortnightlyReports = async (req, res) => {
    try {
        const studentId = req.student._id;
        const reports = await Fortnightly.findOne({ studentId });
        console.log(reports);
        

        if (!reports) {
            await Fortnightly.create({ studentId });
            return res.status(404).json({ message: 'No reports found' });
        }

        res.json(reports);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports.getFortnightlyReportsForStudent = async (req, res) => {
    try {
        const student = await Student.findOne({
            email: req.body.email,
        });
        console.log(student);
        const reports = await Fortnightly.findOne({studentId:student._id});
        res.status(200).json(reports);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

const mongoose = require('mongoose');

module.exports.updateReportStatus = async (req, res) => {
    const { reportId } = req.params;
    const { isUnlocked, email } = req.body;

    try {
        // Find the student based on email
        const student = await Student.findOne({ email: email });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Find the fortnightly report for the student
        const fortnightly = await Fortnightly.findOne({ studentId: student._id });
        if (!fortnightly) {
            return res.status(404).json({ message: 'No fortnightly report found' });
        }

        // Log the reports for debugging
        console.log('Fortnightly Reports:', fortnightly.reports);

        // Convert reportId to ObjectId
        const reportIdObjectId = new mongoose.Types.ObjectId(reportId);

        // Directly find the matching report object using the Map's forEach
        let reportFound = null;

        fortnightly.reports.forEach((report, key) => {
            console.log('Checking report in Map:', report._id);  // Debugging the _id value in each report
            if (report._id && report._id.toString() === reportIdObjectId.toString()) {
                reportFound = report;
            }
        });

        if (!reportFound) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Update the report's 'isUnlocked' status
        reportFound.isUnlocked =!reportFound.isUnlocked;

        // Optionally, you can update the report content if provided in the request body
        if (req.body.report) {
            reportFound.report = req.body.report;
        }

        // Save the updated fortnightly object
        await fortnightly.save();

        // Return success response
        res.status(200).json({ message: 'Report status updated successfully', reportFound });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the report status' });
    }
};
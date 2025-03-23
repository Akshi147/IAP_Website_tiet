const Fortnightly = require('../models/fortnightly.model');

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
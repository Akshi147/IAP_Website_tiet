const mongoose = require('mongoose');

const mentorForm2Schema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    evaluationData: [{
        parameter: { type: String, required: true },
        title: { type: String, required: true },
        details: [{
            label: { type: String, required: true },
            marks: { type: String, required: true }
        }],
        marksObtained: { type: String, required: true }
    }],
    permanentPlacementInfo: { type: String, required: true },
    moreStudentsInfo: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('MentorForm2', mentorForm2Schema);
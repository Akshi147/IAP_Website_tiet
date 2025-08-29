const mongoose = require('mongoose');


const mentorStuForm2Schema = new mongoose.Schema({
    mentorId: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true },
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

module.exports = mongoose.model('MentorStuForm2', mentorStuForm2Schema);
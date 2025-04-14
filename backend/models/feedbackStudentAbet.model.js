const mongoose = require('mongoose');

const feedbackStudentAbetSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true  
    },
    responses: [
        {
            question: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'AbetQuestionStudent',
                required: true
            },
            levelOfAttainment: {
                type: Number,
                min: 1,
                max: 5,
                required: true
            }
        }
    ],
    postGraduationPlan: {
        type: String,
        enum: ['Employment', 'Higher Education', 'Entrepreneur'],
        required: true
    },
    postGraduationPlanDetails: {
        type: String,
        required: true
    }
}, { timestamps: true });


module.exports = mongoose.model('FeedbackStudentAbet', feedbackStudentAbetSchema);
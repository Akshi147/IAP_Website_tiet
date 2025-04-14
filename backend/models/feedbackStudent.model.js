const mongoose = require('mongoose');

const FeedbackStudentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true  
    },
    responses: [{
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FeedbackQuestionStudent',
            required: true
        },
        answer: {
            type: String,
        }
    }],
    collabContact: {
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FeedbackQuestionStudent',
            required: true
        },
        answer: {
            name: String,
            designation: String,
            email: String,
            phone: String
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('FeedbackStudent', FeedbackStudentSchema);
const mongoose = require("mongoose");

const feedbackMentorSchema = new mongoose.Schema({
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mentor",
        required: true,
    }, 
    responses: [{
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FeedbackQuestion",
            required: true,
        },
        levelOfAttainment: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model("FeedbackMentor", feedbackMentorSchema);
const mongoose = require('mongoose');

const FeedbackQuestionStudentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('FeedbackQuestionStudent', FeedbackQuestionStudentSchema);

const mongoose = require('mongoose');

const FeedbackQuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('FeedbackQuestion', FeedbackQuestionSchema);

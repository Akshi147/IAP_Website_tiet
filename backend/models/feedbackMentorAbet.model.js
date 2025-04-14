const mongoose = require('mongoose');

const feedbackABETSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true
  },
  responses: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AbetQuestion',
      required: true
    },
    levelOfAttainment: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    }
  }],
  suggestedCourse: String,
  overallSatisfaction: {
    type: String,
    enum: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('FeedbackABET', feedbackABETSchema);

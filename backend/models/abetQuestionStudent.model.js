const mongoose = require('mongoose');

const abetQuestionStudentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('AbetQuestionStudent', abetQuestionStudentSchema);

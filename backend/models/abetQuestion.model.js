const mongoose = require('mongoose');

const abetQuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('AbetQuestion', abetQuestionSchema);

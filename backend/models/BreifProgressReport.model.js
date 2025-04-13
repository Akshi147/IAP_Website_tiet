const mongoose = require("mongoose");

const BriefProgressReportSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },

  topicOfProject: { type: String, required: true },

  typeOfProject: {
    type: String,
    enum: [
      "Software Development",
      "Research",
      "Hardware Development",
      "Other"
    ],
    required: true,
  },

  assignment1Details: { type: String, required: true },
  assignment1Status: {
    type: String,
    enum: ["On Going", "Completed", "Pending", "Choose One..."],
    required: true,
  },

  assignment2Details: { type: String },
  assignment2Status: {
    type: String,
    enum: ["On Going", "Completed", "Pending", "Choose One..."],
    default: "Choose One...",
  },

  assignment3Details: { type: String },
  assignment3Status: {
    type: String,
    enum: ["On Going", "Completed", "Pending", "Choose One..."],
    default: "Choose One...",
  },

  hrName: { type: String, required: true },
  hrContactNumber: { type: String, required: true },
  hrEmailId: { type: String, required: true },

  remarksByIndustryCoordinator: { type: String }
});

module.exports = mongoose.model("BriefProgressReport", BriefProgressReportSchema);

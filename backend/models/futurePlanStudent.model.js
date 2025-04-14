const mongoose = require("mongoose");

const FuturePlanStudentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
    unique: true,
  },
  futurePlan: {
    type: String,
    enum: [
      "on-campus placement",
      "off-campus placement",
      "higher studies/research",
      "start-up",
      "join family business",
      "unemployed",
    ],
    required: true,
  },
  placementDetails: {
    companyName: String,
    job: String,
    profile: String,
    position: String,
    ctc: String,
    city: String,
    country: String,
  },
  studyDetails: {
    org: String,
    city: String,
    country: String,
    programDetails: String,
  },
  startUpDetails: {
    startUpName: String,
    startUpType: String,
    turnover: String,
    city: String,
    country: String,
  },
  joinFamilyBusinessDetails: {
    companyName: String,
    position: String,
    city: String,
    country: String,
  }
});

module.exports = mongoose.model("FuturePlanStudent", FuturePlanStudentSchema);
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true},
    rollNo: { type: String, required: true, unique: true },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9._%+-]+@thapar\.edu$/  // Only @thapar.edu emails allowed
    },
    semesterType: { type: String, required: true },
    classSubgroup: { type: String, required: true },
    phoneNumber: { type: String, required: true, match: /^[0-9]{10}$/ },

    // Optional fields
    trainingArrangedBy: { type: String, default: null },

    companyDetails: {
        companyName: { type: String, default: null },
        companyCity: { type: String, default: null },
        companyCountry: { type: String, default: null },
        completeAddress: { type: String, default: null },
        landmark: { type: String, default: null },
    },

    password: { type: String, default: null }, // Can be null initially

    mentorName: { type: String, default: null },
    mentorEmail: {
        type: String,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        default: null
    },
    mentorContact: { type: String, match: /^[0-9]{10}$/, default: null },

    trainingStartDate: { type: Date, default: null },
    trainingEndDate: { type: Date, default: null },

    stipend: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now }
});
StudentSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET, { expiresIn: '24h' });
     return token;
    };
    
    StudentSchema.methods.comparePassword = async function(enteredPassword){
        return await bcrypt.compare(enteredPassword,this.password);
    };
    
    StudentSchema.statics.hashPassword = async function(password){
        return await bcrypt.hash(password,10);
    };

module.exports = mongoose.model("Student", StudentSchema);

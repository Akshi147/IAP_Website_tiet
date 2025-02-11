const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { phase3 } = require("../controllers/student.controller");

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true},
    rollNo: { type: String, required: true, unique: true },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@thapar\.edu$/, 'Only @thapar.edu emails are allowed']
    },
    password:{
        type:String,
        required:true,
        select : false,//user lai retrieve garda password dekhaudaina
    },
    verified: { type: Boolean, default: false },
    semesterType: { type: String, required: true },
    classSubgroup: { type: String, required: true },
    phoneNumber: { type: String, required: true, match: /^[0-9]{10}$/ },
    branch: { type: String, required: true },

    // Optional fields
    trainingArrangedBy: { type: String, default: null },

    companyDetails: {
        companyName: { type: String, default: null },
        companyCity: { type: String, default: null },
        companyCountry: { type: String, default: null },
        completeAddress: { type: String, default: null },
        landmark: { type: String, default: null },
    },

    
    mentorName: { type: String, default: null },
    mentorEmail: {
        type: String,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        default: null
    },
    mentorContact: { type: String, match: /^[0-9]{10}$/, default: null },
    mentorverified: { type: Boolean, default: false },

    trainingStartDate: { type: Date, default: null },
    trainingEndDate: { type: Date, default: null },

    stipend: { type: Number, default: 0 },
    trainingLetter: { type: String, default: null },
    feeReceipt: { type: String, default: null },
    phase3:{type:Boolean,default:false},
    phase3verified:{type:Boolean,default:false},
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now }
});
StudentSchema.methods.generateResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // Token expires in 1 hour
    return resetToken;
};

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

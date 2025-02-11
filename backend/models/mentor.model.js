const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const MentorSchema = new mongoose.Schema({
    name: { 
        type: String, 
        default: null 
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // match: [/^[a-zA-Z0-9._%+-]+@thapar\.edu$/, 'Only @thapar.edu emails are allowed']
    },
    password: {
        type: String, 
        select: false, 
        default: null 
    },
    verified: { 
        type: Boolean, 
        default: false 
    },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    // students: [{ 
    //type: mongoose.Schema.Types.ObjectId, ref: "Student" 
    // }],
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});


MentorSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        {_id: this._id},
        process.env.JWT_SECRET,
        {expiresIn: '24h'}
    );

    return token;
};


MentorSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

MentorSchema.statics.hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};


MentorSchema.methods.generateResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // Token expires in 1 hour
    return resetToken;
};


module.exports = mongoose.model("Mentor", MentorSchema);
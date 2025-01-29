const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const FacultySchema = new mongoose.Schema({
    initial: { 
        type: String,
        required: true,
    },
    name: { 
        type: String, 
        required: true 
    },
    designation: { 
        type: String, 
        required: true,
    },
    department: { 
        type: String, 
        required: true
    },
    contactNo: { 
        type: String, 
        required: true, 
        match: /^[0-9]{10}$/ 
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9._%+-]+@thapar\.edu$/  
    },
    password: {
        type: String,
        required: true,
        select: false, 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Generating JWT token
FacultySchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
};

// Comparing the Password
FacultySchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Static method to hash passwords
FacultySchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
};

module.exports = mongoose.model("Faculty", FacultySchema);

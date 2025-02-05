const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    branch: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Generating JWT token
adminSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
};

// Comparing the Password
adminSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Static method to hash passwords
adminSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
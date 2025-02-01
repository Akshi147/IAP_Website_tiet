const AdminModel = require('../models/admin.model');
const blacklistModel = require("../models/blacklist.model");

module.exports.Register = async (req, res) => {
    console.log(req.body);
    try {
        const { email, password } = req.body;

        // Check if the email already exists
        const admin = await AdminModel.findOne({ email });
        if (admin) {
            return res.status(400).json({
                success: false,
                message: 'Admin already exists'
            });
        }

        // Create a new admin
        const newAdmin = new AdminModel({ email, password });
        await newAdmin.save();

        // Return token
        const token = newAdmin.generateAuthToken();
        res.cookie('token', token);

        res.status(200).json({
            success: true,
            message: 'Admin created successfully',
            token
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
    });
}};

module.exports.Login = async (req, res) => {
    try {
        const admin = await AdminModel.findOne({ email: req.body.email })
        if (!admin) {
            return res.status(400).json({
                success: false,
                message: 'Admin not found'
            });
        }

        if(admin.password !== req.body.password){
            return res.status(400).json({
                success: false,
                message: 'Invalid password'
            });
        }

        const token = admin.generateAuthToken();
        res.cookie('token', token);

        res.status(200).json({
            success: true,
            message: 'Admin logged in successfully',
            token
        });

    } catch (error) {
        
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports.Logout = async (req, res) => {
    try {
        res.clearCookie('token');
        const token = req.cookies.token || req.headers.authorization.split(" ")[1];
        await blacklistModel.create({token});

        res.status(200).json({
            success: true,
            message: 'Admin logged out successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports.GetProfile = async (req, res) => {

    try {
        const admin = req.admin;
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Admin found',
            admin
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
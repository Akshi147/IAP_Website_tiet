const studentModel = require('../models/student.model');
const facultyModel = require("../models/faculty.model");
const AdminModel = require('../models/admin.model');
const blacklistModel = require('../models/blacklist.model');
const jwt = require('jsonwebtoken');


module.exports.authStudent = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];
    } catch (error) {
        res.status(400).json({message:'Token Not Received'});
    }
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];
    console.log(token);
    if(!token){
        return res.status(401).json({message:'Unauthorized'});
    }
    const isBlacklisted = await blacklistModel.findOne({token:token});
    if(isBlacklisted){
        return res.status(401).json({message:'Unauthorized'})
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const student = await studentModel.findById(decoded._id);
        req.student = student;
        return next();
    } catch (error) {
        return res.status(401).json({message:'Unauthorized'});
    }

};



//faculty auth
module.exports.authFaculty = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];
    } catch (error) {
        res.status(400).json({
            success: false,
            message:'Token Not Received'
        });
    }

    const token = req.cookies.token || req.headers.authorization.split(' ')[1];
    console.log(token);

    if(!token){
        return res.status(401).json({
            success: false,
            message:'Unauthorized'
        });
    }

    //checking if it is in the blacklist
    const isBlacklisted = await blacklistModel.findOne({token:token});

    if(isBlacklisted){
        return res.status(401).json({
            success: false,
            message:'Unauthorized'
        });
    }

    //decoding the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const faculty = await facultyModel.findById(decoded._id);
        req.faculty = faculty;
        return next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message:'Unauthorized'
        });
    }
}


//admin auth
module.exports.authAdmin = async (req, res, next) => {
    try {
        let token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(' ')[1] : null);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: No token provided'
            });
        }

        // Checking if the token is blacklisted
        const isBlacklisted = await blacklistModel.findOne({ token });

        if (isBlacklisted) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Token is blacklisted'
            });
        }

        // Decoding the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await AdminModel.findById(decoded._id);

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Admin not found'
            });
        }

        req.admin = admin;
        next();
    } catch (error) {
        console.error('Auth Error:', error);
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: Invalid or expired token',
            error: error.message
        });
    }
};


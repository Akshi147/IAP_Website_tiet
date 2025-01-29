const studentModel = require('../models/student.model');
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
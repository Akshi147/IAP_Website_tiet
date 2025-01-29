const studentModel = require('../models/student.model');
const { validationResult } = require('express-validator');
const blacklistModel = require('../models/blacklist.model');


module.exports.registerStudent = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const studentExists = await studentModel.findOne({ email: req.body.email });
        if (studentExists) {
            return res.status(400).json({ message: 'Student already exists' });
        }
        const hashPassword = studentModel.hashPassword(req.body.password);

        const student = new studentModel({
            name: req.body.name,
            email: req.body.email,
            password: hashPassword,
            phoneNumber: req.body.phoneNumber,
            rollNo: req.body.rollNo,
            semesterType: req.body.semesterType,
            classSubgroup: req.body.classSubgroup,
        });
        await student.save();
        const token = student.generateAuthToken();
        res.cookie('token',token);

        res.status(201).json({ message: 'Student registered successfully' ,student,token});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
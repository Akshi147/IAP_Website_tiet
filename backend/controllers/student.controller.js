const studentModel = require('../models/student.model');
const { validationResult } = require('express-validator');
const blacklistModel = require('../models/blacklist.model');


module.exports.registerStudent = async (req, res) => {
    try {
        console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const studentExists = await studentModel.findOne({ email: req.body.email });
        if (studentExists) {
            return res.status(400).json({ message: 'Student already exists' });
        }
        const hashPassword = await studentModel.hashPassword(req.body.password);

        const student = new studentModel({
            name: req.body.name,
            email: req.body.email,
            password: hashPassword,
            phoneNumber: req.body.phoneNumber,
            rollNo: req.body.rollNo,
            semesterType: req.body.semesterType,
            classSubgroup: req.body.classSubgroup,
            branch: req.body.branch,
            trainingArrangedBy: req.body.trainingArrangedBy,
            companyDetails: {
                companyName: req.body.companyName,
                companyCity: req.body.companyCity,
            },
        });
        await student.save();
        const token = student.generateAuthToken();
        res.cookie('token',token);

        res.status(201).json({ message: 'Student registered successfully' ,student,token});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports.loginStudent = async (req, res) => {
    try {
        console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const student = await studentModel.findOne({ rollNo: req.body.rollNo }).select('+password')
        if (!student) {
            return res.status(400).json({ message: 'Student not found' });
        }
        const validPassword = await student.comparePassword(req.body.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const token = student.generateAuthToken();
        res.cookie('token',token);
        res.status(200).json({ message: 'Student logged in successfully', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports.getStudentProfile = async (req, res) => {
    try {
        const student = req.student;
        res.status(200).json({ student });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports.logoutStudent = async (req,res)=>{
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];
    await blacklistTokenModel.create({token});

    res.status(200).json({message:'Logged out successfully'});
}

module.exports.uploadFile = async (req,res)=>{
    if (!req.file) {
        return res.status(400).send("No files were uploaded");
      }

    const student = req.student;
    student.trainingLetter=req.file.filename;
    await student.save();
    res.status(200).json({message:'File uploaded successfully'});
};


module.exports.downloadTrainingLetter = async (req,res)=>{
    const student = req.student;
    if(!student.trainingLetter){
        return res.status(404).json({message:'File not found'});
    }
    res.download(`../backend/public/images/uploads/${student.trainingLetter}`);
};
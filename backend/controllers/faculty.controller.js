const facultyModel = require("../models/faculty.model");
const studentModel = require("../models/student.model");
const FacultyModel = require("../models/student.model");
const { validationResult } = require("express-validator");


module.exports.registerFaculty = async (req, res) => {
    try{
        //validation
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        //checking if faculty getting registered already exists 
        const facultyExists = await facultyModel.findOne({
            email: req.body.email
        });

        //faculty exists
        if(facultyExists){
            return res.status(400).json({
                success: false,
                message: "Faculty already exists"
            })
        }

        //faculty doesn't exists
        const hashedPassword = await facultyModel.hashPassword(req.body.password);

        const faculty = new facultyModel({
            initial: req.body.initial,
            name: req.body.name,
            designation: req.body.designation,
            department: req.body.department,
            contactNo: req.body.contactNo,
            email: req.body.email,
            password: hashedPassword  
        });

        await faculty.save();
        const token = faculty.generateAuthToken();
        res.cookie("token", token);

        res.status(201).json({
            success: true,
            message: "Faculty has registered successfully",
            faculty,
            token
        });
    }catch(err){
        res.status(500).json({
            success: false,
            error: err.message
        })
    }
}



module.exports.loginFaculty = async (req, res) => {
    try{
        //validation
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const faculty = await facultyModel.findOne({
            email: req.body.email
        }).select("+password");

        //faculty doesn't exists
        if(!faculty){
            return res.status(400).json({
                success: false,
                message: "Student not found",
            })
        }

        //faculty exists in DB
        const validPassword = await faculty.comparePassword(req.body.password);
        
        if(!validPassword){
             return res.status(400).json({
                success: false,
                message: "Invalid password"
            })
        }

        const token = faculty.generateAuthToken();
        res.cookie("token", token);

        res.status(200).json({
            success: true,
            message: "Faculty has logged in successfully",
            token
        })
    }catch(err){
        res.status(500).json({
            success: false,
            error: err.message
        })
    }
}
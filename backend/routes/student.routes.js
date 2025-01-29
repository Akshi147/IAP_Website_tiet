const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const studentController = require('../controllers/student.controller');

router.post('/register',[
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('phoneNumber').isLength({min:10,max:10}).withMessage('Please enter a valid phone number'),
    body('rollNo').isLength({min:8,max:15}).withMessage('Please enter a valid roll number'),
    body('semesterType').not().isEmpty().withMessage('Please enter a valid semester type'),
    body('classSubgroup').not().isEmpty().withMessage('Please enter a valid class subgroup'),
    body('name').isLength({min:3}).withMessage('Firstname must be atleast 3 characters long'),
],studentController.registerStudent);



module.exports = router;
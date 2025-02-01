const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const studentController = require('../controllers/student.controller');
const {authStudent,authFaculty,authAdmin}=require('../middlewares/auth.middleware');
const upload = require('../libs/multer');

router.post('/register',[
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('phoneNumber').isLength({min:10,max:10}).withMessage('Please enter a valid phone number'),
    body('rollNo').isLength({min:8,max:15}).withMessage('Please enter a valid roll number'),
    body('semesterType').not().isEmpty().withMessage('Please enter a valid semester type'),
    body('classSubgroup').not().isEmpty().withMessage('Please enter a valid class subgroup'),
    body('name').isLength({min:3}).withMessage('Firstname must be atleast 3 characters long'),
    body('password').isLength({min:3}).withMessage('Password must be atleast 3 characters long')
],studentController.registerStudent);


router.get('/verifyStudent/:param',studentController.verifyStudent)


router.post('/login',[
    body('rollNo').isLength({min:8,max:15}).withMessage('Please enter a valid roll number'),
    body('password').isLength({min:3}).withMessage('Password must be atleast 3 characters long')
],studentController.loginStudent);

router.get('/logout',authStudent,studentController.logoutStudent);
router.get('/profile',authStudent,studentController.getStudentProfile);
router.post('/uploadfile',authStudent,upload.single('trainingLetter'),studentController.uploadFile);
router.post('/uploadfiles',authStudent,upload.single('feeReceipt'),studentController.uploadFiles);

router.get('/downloadfile/:trainingLetter',authAdmin,studentController.downloadTrainingLetter);
router.get('/downloadfile/:feeReceipt',authAdmin,studentController.downloadFeeReceipt);
router.get('/verifyStudentDocument/:rollNo',authAdmin,studentController.verifyStudentDocument);
router.post("/sendEmail/:rollNumber", authAdmin, studentController.sendErrorEmail);
router.post("/completeverify/:rollNo", authAdmin, studentController.completeVerify);



module.exports = router;
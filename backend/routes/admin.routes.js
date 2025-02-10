const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const adminController = require('../controllers/admin.controller.js');
const {authAdmin}=require('../middlewares/auth.middleware');

router.post('/register',adminController.Register);
router.post('/login',adminController.Login);
router.get('/logout',authAdmin,adminController.Logout);
router.get('/profile',authAdmin,adminController.GetProfile);
router.post('/forgotpassword',adminController.ForgotPassword);
router.post('/changepassword',authAdmin,adminController.ChangePassword);
router.get('/underdocumentverification',authAdmin,adminController.UnderDocumentVerification);
router.get('/underphase2verification',authAdmin,adminController.UnderPhase2Verification);
router.post('/verifyphase2/:rollNo',authAdmin,adminController.VerifyPhase2);
router.post('/unlockphase2/:rollNo',authAdmin,adminController.UnlockPhase2);

module.exports = router;

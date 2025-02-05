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


module.exports = router;

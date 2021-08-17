'use strict';

const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const validator = require('../middleware/validator');
const auth = require('../middleware/auth');

// router.get('/register/address', auth.verifyToken, authController.getAddress);
router.post('/login', validator.loginValidator, authController.login);
router.post('/register', validator.registerValidator, authController.register);
router.post('/forget_password', validator.checkPhoneExitsValidator, authController.forgetPassword);
router.post('/verify_code', authController.verifyCode); 
router.post('/change_forget_password', validator.changePasswordValidator, authController.changePassword);
router.post('/change_password', auth.verifyToken, validator.changePasswordValidator, authController.changePassword);
router.post('/logout', auth.verifyToken, authController.logout);

module.exports = router;

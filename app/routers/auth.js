'use strict';

const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const validator = require('../middleware/validator');
const auth = require('../middleware/auth');

router.get('/register/address', auth.verifyToken, authController.getAddress);
router.post('/login', validator.loginValidator, authController.login);
router.post('/register', validator.registerValidator, authController.register);
router.post('/forget_password', auth.verifyToken, authController.forgetPassword);
router.post('/logout', auth.verifyToken, authController.logout);

module.exports = router;

const { body } = require('express-validator');

exports.registerValidator = [
    body('phone')
        .matches(/^(09|\+849|849|08|\+848|848)\d{8}$/).withMessage('Invalid phone number'),
    body('password')
        .isLength({ min: 5 }).withMessage('Password must be at least 5 chars long'),
    body('repeat_password')
        .isLength({ min: 5 }).withMessage('Password must be at least 5 chars long'),
    body('firstname')
        .matches(/\b/).withMessage('The name contain invalid characters'),
    body('lastname')
        .matches(/\b/).withMessage('The name contain invalid characters'),
];

exports.loginValidator = [
    body('phone')
        .matches(/^(09|\+849|849|08|\+848|848)\d{8}$/).withMessage('Invalid phone number'),
    body('password')
        .isLength({ min: 5 }).withMessage('Password must be at least 5 chars long'),
];

exports.changePasswordValidator = [
    body('old_password')
        .isLength({ min: 5 }).withMessage('Password must be at least 5 chars long'),
    body('new_password')
        .isLength({ min: 5 }).withMessage('Password must be at least 5 chars long'),
    body('repeat_new_password')
        .isLength({ min: 5 }).withMessage('Password must be at least 5 chars long'),
];

exports.checkPhoneExitsValidator = [
    body('phone')
        .matches(/^(09|\+849|849|08|\+848|848)\d{8}$/).withMessage('Invalid phone number'),
];

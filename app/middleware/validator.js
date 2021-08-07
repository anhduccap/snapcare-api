const { body } = require('express-validator');

exports.registerValidator = [
    body('phone')
        .matches(/^(09|\+849|849|08|\+848|848)\d{8}$/).withMessage('Invalid phone number'),
    body('password')
        .isLength({ min: 5 }).withMessage('Password must be at least 5 chars long'),
    body('fullname')
        .matches(/\b/).withMessage('The name contain invalid characters'),
]

exports.loginValidator = [
    body('phone')
        .matches(/^(09|\+849|849|08|\+848|848)\d{8}$/).withMessage('Invalid phone number'),
    body('password')
        .isLength({ min: 5 }).withMessage('Password must be at least 5 chars long'),
]
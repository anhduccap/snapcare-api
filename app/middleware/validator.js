const { body } = require('express-validator');

// [ ----------- Auth ----------- ]
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

// [ ----------- Healthbook ----------- ]
exports.createHealthbookValidator = [
    body('fullname')
        .isLength({ max: 25 }).withMessage('Your name is too long')
        .not().isEmpty().trim().escape().withMessage('Invalid name'),
    body('phone')
        .matches(/^(09|\+849|849|08|\+848|848)\d{8}$/).withMessage('Invalid phone number'),
    body('symptom')
        .isLength({ max: 255 }).withMessage('Limit length')
        .not().isEmpty().trim().escape().withMessage('Invalid text'),
    body('height')
        .matches(/^[0-9]*$/).withMessage('Invalid number'),
    body('weight')
        .matches(/^[0-9]*$/).withMessage('Invalid number'),
];

exports.updateAvatarValidator = [

];

exports.updateFullnameValidator = [
    body('fullname')
        .isLength({ max: 25 }).withMessage('Your name is too long')
        .not().isEmpty().trim().escape().withMessage('Invalid name'),
];

exports.updatePhoneValidator = [
    body('phone')
        .matches(/^(09|\+849|849|08|\+848|848)\d{8}$/).withMessage('Invalid phone number'),
];

exports.updateAddressValidator = [
    body('address_detail')
        .isLength({ max: 125 }).withMessage('Address is too long')
        .not().isEmpty().trim().escape().withMessage('Invalid text'),
];

exports.updateHealthIndexValidator = [
    body('height')
        .matches(/^[0-9]*$/).withMessage('Invalid number'),
    body('weight')
        .matches(/^[0-9]*$/).withMessage('Invalid number'),
];

exports.updateSymptomValidator = [
    body('symptom')
        .isLength({ max: 255 }).withMessage('Limit length')
        .not().isEmpty().trim().escape().withMessage('Invalid text'),
];

exports.commentValidator = [
    body('symptom')
        .isLength({ max: 8000 }).withMessage('Limit length')
        .not().isEmpty().trim().escape().withMessage('Invalid text'),
]

exports.bookingValidator = [
    body('request')
        .isLength({ max: 255 }).withMessage('Limit length')
        .not().isEmpty().trim().escape().withMessage('Invalid text'),
]

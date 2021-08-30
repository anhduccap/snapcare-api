const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Nexmo = require('nexmo');
// const messagebird = require('messagebird')('');

const UserSchema = require('../models/user/user');
const helper = require('../helper/index');
// const addressHelper = require('./helper/getAddress');

// Test token
// exports.getAddress = async function (req, res, next) {
//     let addressList = await addressHelper.getAddress()
//         .catch(err => { throw err});
//     res.json({
//         address_list: addressList,
//         user: req.userId,
//     });
// }


exports.login = async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .send( helper.responseFailure(false, '400', 'Invalid input', errors.array()) );
    } else {
        req.body.phone = helper.standardizePhoneNumber(req.body.phone);
        const user = await UserSchema.findOne({phone: req.body.phone});
        if(!user) return res
            .status(403)
            .send( helper.responseFailure(false, '403', 'The phone number or password are incorrect!'));
        else {
            const block_time = 60000;

            const validatePassword = await bcrypt.compare(req.body.password, user.password);

            const validatePasswordFn = function() {
                if(validatePassword) {
                    //initialize token
                    const token = jwt.sign({
                        data: {
                            userId: user._id,
                        },
                        exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    }, process.env.TOKEN_SECRET_KEY);
    
                    //update last login time
                    UserSchema.findOneAndUpdate(
                        { _id: user._id, },
                        { 
                            date_last_login: Date.now(), 
                            login_time_left: 5,
                            is_active: 1,
                            is_login: 1,
                        },
                    ).catch(next);
    
                    return res
                        .status(200)
                        // .send( helper.responseSuccess(true, '200', 'Login successfully!', user) );
                        .send( helper.responseSuccess(true, '200', 'Login successfully!', {userId: user._id, token: token}) ); 
                }
                else {
                    UserSchema.findOneAndUpdate(
                        { _id: user._id, }, 
                        { login_time_left: user.login_time_left - 1, },
                    ).catch(next);
                    return res
                        .status(403)
                        .send( helper.responseFailure(false, '403', 'The phone number or password are incorrect!'));
                }
            }

            if(user.is_active === 1) {
                if(user.login_time_left !== 0) {
                    validatePasswordFn();
                }
                else {
                    UserSchema.findOneAndUpdate(
                        { _id: user._id, }, 
                        { 
                            is_active: 0,
                            is_login: 0,
                            date_last_blocked: Date.now(),
                            login_time_left: 5,
                        },
                    ).catch(next);
                    return res
                        .status(401)
                        .send( helper.responseFailure(false, '401', `You were failed in login too much. Your account was be blocked in ${block_time/1000} seconds.`));
                }
            }
            else if(user.is_active === 0 && Date.now() - user.date_last_blocked > block_time) {
                validatePasswordFn();
            }
            else {
                return res
                    .status(401)
                    .send( helper.responseFailure(false, '401', 'Your account was be blocked. Please try again in a few minutes.'));
            }
        }
    }
}

exports.register = async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .send( helper.responseFailure(false, '400', 'Invalid input', errors.array()) );
    }
    else {
        req.body.phone = helper.standardizePhoneNumber(req.body.phone);

        //check existed user
        const user = await UserSchema.findOne({phone: req.body.phone});

        if(!user) {
            // repeat password
            if(req.body.repeat_password !== req.body.password) {
                return res
                    .status(400)
                    .send( helper.responseFailure(false, '400', 'The password is repeated incorrectly'))
            }
            else{
                //hash password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(req.body.password, salt);

                const fullname = `${req.body.firstname} ${req.body.lastname}`;
                const displayname = `${req.body.firstname}`;

                const User = new UserSchema({
                    phone: req.body.phone,
                    password: hashedPassword,

                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    fullname: fullname,
                    displayname: displayname,

                    country_code: req.body.country_code,
                    province_code: req.body.province_code,
                });
                const savedUser = await User.save();
                return res
                    .status(200)
                    .send( helper.responseSuccess(true, '200', 'Your account has been created successfully!', savedUser) );
            }
        }
        else {
            return res
                .status(400)
                .send( helper.responseFailure(false, '400', 'The user is existed') );
        }
    }
}

exports.forgetPassword = async function(req, res, next) {
    req.body.phone = helper.standardizePhoneNumber(req.body.phone);
    const user = await UserSchema.findOne({phone: req.body.phone});

    const nexmo = new Nexmo({
        apiKey: process.env.NEXMO_API_KEY,
        apiSecret: process.env.NEXMO_API_SECRET_KEY,
    });

    if(!user) {
        return res
            .status(400)
            .send( helper.responseFailure(false, '400', 'The user is not exist') );
    }
    else {
        const toPhone = helper.internationalPhoneNumber(req.body.phone);
        nexmo.message.sendSms(
            'Nexmo',
            '84845248345',
            'A text message sent using the Vonage SMS API',
            (err, response) => {
                if(err) { 
                    return res
                        .status(403)
                        .send( helper.responseFailure(false, '403', '', err));
                }
                else {
                    if(response.messages[0]['status'] === "0") {
                        return res
                            .status(200)
                            .send( helper.responseSuccess(true, '200', 'Message sent successfully.'));
                    } else {
                        return res
                            .status(403)
                            .send( helper.responseFailure(false, '403', `Message failed with error: ${response.messages[0]['error-text']}`));
                    }
                }
            }
        )
    }



    // messagebird.messages.create({
    //     'originator': 'TestMessage',
    //     'recipients': [
    //         84845248345
    //     ],
    //     'body': 'This is a test message',
    // }, function(err, response) {
    //     if(err) {
    //         return res
    //             .status(403)
    //             .send( helper.responseFailure(false, '403', 'Failed verification', err.errors[0].description));
    //     }
    //     else {
    //         return res
    //             .status(200)
    //             .send( helper.responseSuccess(true, '200', 'Verification code is sent successfully', response) );
    //     }
    // });
}

exports.verifyCode = async function(req, res, next) {
    // const userId = req.userId;
    // const token = req.headers('messagebird-token');

    // messagebird.verify.verify(userId, token, function(err, response) {
    //     if(err) {
    //         return res
    //             .status(403)
    //             .send( helper.responseFailure(false, '403', 'Your verification code is incorrect', err.errors[0].description) );
    //     }
    //     return res
    //         .status(200)
    //         .send( helper.responseSuccess(true, '200', 'Your verification code is correct', response) );
    // })
}

exports.changePassword = async function(req, res, next) {
    const {old_password, new_password, repeat_new_password} = req.body;

    if(old_password === new_password) {
        return res
            .status(400)
            .send( helper.responseFailure(false, '400', 'the new password must be different from the old password') );
    }
    else if(new_password !== repeat_new_password) {
        return res
            .status(400)
            .send( helper.responseFailure(false, '400', 'The password was repeated incorrectly') );
    }
    else{
        const user = await UserSchema.findOne({_id: req.userId});
        const validatePassword = await bcrypt.compare(old_password, user.password);
        if(!validatePassword){
            return res
                .status(400)
                .send( helper.responseFailure(false, '400', 'The old password is not correct') );
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(new_password, salt);

        UserSchema.findOneAndUpdate(
            { _id: req.userId },
            { 
                password: hashedPassword,
                date_edited: Date.now(),
            },
        ).catch(next);

        return res
            .status(200)
            .send( helper.responseSuccess(true, '200', 'The password was updated successfully') );
    }
}

exports.logout = async function(req, res, next) {
    UserSchema.findOneAndUpdate(
        { 
            _id: req.userId,
            is_login: 1,
        },
        { 
            is_login: 0,
        }
    ).catch(next);

    return res
        .status(200)
        .send( helper.responseSuccess(true, '200', 'Success') );
}

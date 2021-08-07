const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = require('../models/user/user');
const helper = require('./helper/index');
const addressHelper = require('./helper/getAddress');

exports.getAddress = async function (req, res, next) {
    let addressList = await addressHelper.getAddress()
        .catch(err => { throw err});
    res.json({
        address_list: addressList,
        user: req.userId,
    });
}

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
            .send( helper.responseFailure(false, '403', 'User is not existing'));
        else {
            const validatePassword = await bcrypt.compare(req.body.password, user.password);
            if(validatePassword) { 
                const token = jwt.sign({
                    id: user._id,
                    exp: Math.floor(Date.now() / 1000) + (1 * 60),
                }, process.env.TOKEN_SECRET_KEY);
                return res
                    .status(200)
                    // .send( helper.responseSuccess(true, '200', 'Login successfully!', user) );
                    .send( helper.responseSuccess(true, '200', 'Login successfully!', {token: token}) ); 
            }
            else {
                return res
                    .status(403)
                    .send( helper.responseFailure(false, '403', 'The password is incorrect'));
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
            //hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            const User = new UserSchema({
                phone: req.body.phone,
                password: hashedPassword,
                fullname: req.body.fullname,
                district: req.body.district,
            });
            const savedUser = await User.save();
            return res
                .status(200)
                .send( helper.responseSuccess(true, '200', 'Your account has been created successfully!', savedUser) );
        }
        else {
            return res
                .status(400)
                .send( helper.responseFailure(false, '400', 'The user is existed') );
        }
    }
}

exports.forgetPassword = async function(req, res, next) {

}

exports.logout = async function(req, res, next) {
    
}

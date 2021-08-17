'use strict';

const mongoose = require('mongoose');
const Int32 = require('mongoose-int32').loadType(mongoose);
const userSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    phone: String,
    password: String,

    healthbook: {
        type: Array,
        default: [],
    },

    firstname: String,
    lastname: String,
    fullname: String,
    displayname: String,

    avatar: {
        type: Object,
        default: null,
    },

    country_code: String,
    province_code: String,

    date_created: {
        type: Number,
        default: Date.now(),
    },
    date_edited: {
        type: Number,
        default: null,
    },
    date_last_login: {
        type: Number,
        default: null,
    },

    is_login: {
        type: Int32,
        default: 0,
    },
    login_time_left: {
        type: Int32,
        default: 5,
    },
    is_active: { //is blocked or not
        type: Int32,
        default: 1,
    },
    date_last_blocked: {
        type: Number,
        default: null,
    },
}, {
    // _id: false,
    collection: 'User', 
    minimize: false
});

const User = mongoose.model('User', userSchema);

module.exports = User;

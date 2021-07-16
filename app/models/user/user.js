'use strict';

const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    healthbook: Array,
    phone: String,
    password: {
        type: String,
        minLength: 8,
        maxLength: 16,
    },
    fullname: String,
    district: Int32,
    date_created: Number,
}, {_id: false, collection: 'User', minimize: false});

const User = mongoose.model('User', userSchema);

module.exports = User;

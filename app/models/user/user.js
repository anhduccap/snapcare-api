'use strict';

const mongoose = require('mongoose');
const Int32 = require('mongoose-int32').loadType(mongoose);
const userSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    phone: String,
    password: {
        type: String,
        minLength: 5,
    },
    fullname: String,
    district: String,
    date_created: {
        type: Number,
        default: Date.now(),
    },
    healthbook: {
        type: Array,
        default: [],
    },
}, {
    // _id: false,
    collection: 'User', 
    minimize: false
});

const User = mongoose.model('User', userSchema);

module.exports = User;

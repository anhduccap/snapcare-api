'use strict';

const mongoose = require('mongoose');
const wardSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    district_code: String,
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address_District'
    },
    code: String,
    prefix: String,
    name: String,
}, {
    // _id: false, 
    collection: 'Address_Ward', 
    minimize: false});

const Address_Ward = mongoose.model('Address_Ward', wardSchema);

module.exports = Address_Ward;

'use strict';

const mongoose = require('mongoose');
const districtSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    province_code: String,
    province: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address_Province',
    },
    code: String,
    prefix: String,
    name: String,
}, {
    // _id: false, 
    collection: 'Address_District', 
    minimize: false});

const Address_District = mongoose.model('Address_District', districtSchema);

module.exports = Address_District;

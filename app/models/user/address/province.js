'use strict';

const mongoose = require('mongoose');
const provinceSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    country_code: String,
    code: String,
    name: String,
}, {
    // _id: false,
    collection: 'Address_Province', 
    minimize: false});

const Address_Province = mongoose.model('Address_Province', provinceSchema);

module.exports = Address_Province;

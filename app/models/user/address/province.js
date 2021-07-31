'use strict';

const mongoose = require('mongoose');
const provinceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    countryCode: {
        type: String,
        default: '',
    },
    code: {
        type: String,
        default: '',
    },
    province: String,
    districts: {
        type: Array,
        default: [],
    },
}, {_id: false, collection: 'Address_Province', minimize: false});

const Address_Province = mongoose.model('Address_Province', provinceSchema);

module.exports = Address_Province;

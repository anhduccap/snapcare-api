'use strict';

const mongoose = require('mongoose');
const districtSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    provinceCode: {
        type: String,
        default: '',
    },
    code: {
        type: String,
        default: '',
    },
    prefix: String,
    district: String,
    wards: {
        type: Array,
        default: [],
    }
}, {_id: false, collection: 'Address_District', minimize: false});

const Address_District = mongoose.model('Address_District', districtSchema);

module.exports = Address_District;

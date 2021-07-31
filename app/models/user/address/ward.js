'use strict';

const mongoose = require('mongoose');
const wardSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    districtCode: {
        type: String,
        default: '',
    },
    code: {
        type: String,
        default: '',
    },
    prefix: String,
    ward: String,
}, {_id: false, collection: 'Address_Ward', minimize: false});

const Address_Ward = mongoose.model('Address_Ward', wardSchema);

module.exports = Address_Ward;

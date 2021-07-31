'use strict';

const mongoose = require('mongoose');
const countrySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    code: {
        type: String,
        default: '',
    },
    country: String,
    provinces: {
        type: Array,
        default: [],
    },
}, {_id: false, collection: 'Address_Country', minimize: false});

const Address_Country = mongoose.model('Address_Country', countrySchema);

module.exports = Address_Country;

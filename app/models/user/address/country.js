'use strict';

const mongoose = require('mongoose');
const countrySchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    code: String,
    name: String,
}, {
    // _id: false,
    collection: 'Address_Country', 
    minimize: false});

const Address_Country = mongoose.model('Address_Country', countrySchema);

module.exports = Address_Country;

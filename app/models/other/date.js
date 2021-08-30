'use strict';

const mongoose = require('mongoose');
const Int32 = require('mongoose-int32').loadType(mongoose);

const DateSchema = mongoose.Schema({
    year: Int32,
    month: Int32,
    day: Int32,
}, {
    collection: 'Date',
    minimize: false,
});

module.exports = mongoose.model('Date', DateSchema);

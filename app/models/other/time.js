'use strict';

const mongoose = require('mongoose');
const Int32 = require('mongoose-int32').loadType(mongoose);

const TimeSchema = mongoose.Schema({
    code: Int32,
    name: String,
    start_hour: Int32,
    start_minute: {
        type: Int32,
        default: 0,
    },
    start_second: {
        type: Int32,
        default: 0,
    },
    end_hour: Int32,
    end_minute: {
        type: Int32,
        default: 0,
    },
    end_second: {
        type: Int32,
        default: 0,
    },
}, {
    collection: 'Time',
    minimize: false,
});

module.exports = mongoose.model('Time', TimeSchema);

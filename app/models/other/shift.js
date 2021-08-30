'use strict';

const mongoose = require('mongoose');

const ShiftSchema = mongoose.Schema({
    date: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Date',
    },
    time: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Time',
    },
}, {
    collection: 'Shift',
    minimize: false,
});

module.exports = mongoose.model('Shift', ShiftSchema);

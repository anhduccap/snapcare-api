'use strict';

const mongoose = require('mongoose');
const Int32 = require('mongoose-int32').loadType(mongoose);
const NurseBookingSchema = mongoose.Schema({
    id: String,
    healthbook: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Healthbook',
    },
    nurse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Nurse',
    },
    time_slot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Time_slot',
    },
    
    request: String,
    payment_method: Int32, //1: cash  2: digital wallet
    coupon: {
        type: String,
        default: '',
    },

    process: {
        type: Int32,
        default: 1,
    },

    date_created: {
        type: Number,
        default: Date.now(),
    },
}, {
    collection: 'Healthbook_book_nurse',
    minimize: false,
});

module.exports = mongoose.model('Healthbook_book_nurse', NurseBookingSchema);

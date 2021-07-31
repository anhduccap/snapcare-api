'use strict';

const mongoose = require('mongoose');
const Int32 = require('mongoose-int32').loadType(mongoose);
const nurseBookingSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    healthbookId: mongoose.Schema.Types.ObjectId,
    nurseId: mongoose.Schema.Types.ObjectId,
    date_created: Number,
    request: String,
    booking_time: Object,
    payment_method: Int32, //1: cash  2: digital wallet
}, {_id: false, collection: 'Nurse_voting', minimize: false});

const Nurse_voting = mongoose.model('Nurse_voting', nurseBookingSchema);

module.exports = Nurse_voting;

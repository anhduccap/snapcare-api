'use strict';

const mongoose = require('mongoose');
const clinicBookingSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    clinicId: mongoose.Schema.Types.ObjectId,
    date_created: Number,
    booking_time: Int32, //1:13h 2:15h 3:17h
    booking_date: Number,
    booking_request: String,
}, {_id: false, collection: 'Clinic_booking', minimize: false});

const Clinic_booking = mongoose.model('Clinic_booking', clinicBookingSchema);

module.exports = Clinic_booking;

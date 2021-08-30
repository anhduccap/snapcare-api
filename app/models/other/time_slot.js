'use strict';

const mongoose = require('mongoose');

const TimeSlotSchema = mongoose.Schema({
    nurse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Nurse',
    },
    shift: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shift',
    },
    is_booked: {
        type: Boolean,
        default: false,
    },

    healthbook: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HealthBook',
        default: null,
    },
    booking_data: {
        type: Object,
        default: null,
    },
}, {
    collection: 'Time_slot',
    minimize: false,
});

module.exports = mongoose.model('Time_slot', TimeSlotSchema);

'use strict';

const mongoose = require('mongoose');
const clinicSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    clinic_name: String,
    logo: {
        type: String,
        default: '',
    },
    address: String,
    albums: Array,
    phone: String,
    services: {
        type: Array,
        default: [],
    },
    active_time: Object,
    is_active: {
        type: Number,
        default: 1,
    },
    lat: Number,
    lon: Number,
}, {_id: false, collection: 'Clinic', minimize: false});

const Clinic = mongoose.model('Clinic', clinicSchema);

module.exports = Clinic;
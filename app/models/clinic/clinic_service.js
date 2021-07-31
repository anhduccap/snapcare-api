'use strict';

const mongoose = require('mongoose');
const Int32 = require('mongoose-int32').loadType(mongoose);
const clinicServiceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    clinicId: mongoose.Schema.Types.ObjectId,
    service_name: String,
    fee: Int32,
    service_detail: Array
}, {_id: false, collection: 'Clinic_service', minimize: false});

const Clinic_service = mongoose.model('Clinic_service', clinicServiceSchema);

module.exports = Clinic_service;

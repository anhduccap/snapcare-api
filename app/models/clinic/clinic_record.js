'use strict';

const mongoose = require('mongoose');
const clinicRecordSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    clinicId: mongoose.Schema.Types.ObjectId,
    healthbookId: mongoose.Schema.Types.ObjectId,
    medicine: Array, //List of object medicine: name, quantity, using
    date_created: Number,
}, {_id: false, collection: 'Clinic_record', minimize: false});

const Clinic_record = mongoose.model('Clinic_record', clinicRecordSchema);

module.exports = Clinic_record;

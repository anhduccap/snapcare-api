'use strict';

const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');
const medicineExportSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    medicineId: mongoose.Schema.Types.ObjectId,
    drugstoreId: mongoose.Schema.Types.ObjectId,
    date_create: Number,
    quantity: Int32,
}, {_id: false, collection: 'Medicine_export', minimize: false});

const Medicine_export = mongoose.model('Medicine_export', medicineExportSchema);

module.exports = Medicine_export;

'use strict';

const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');
const prescriptionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    drugstoreId: mongoose.Schema.Types.ObjectId,
    medicine_list: Array, //list medicine ID
    medicine_price: Number,
    delivery_charge: Number,
    status: Int32, // 1: confirmed  2: delivered  3: received
    payment_method: {
        type: Int32, // 1: cash  2: digital wallet
        default: 1,
    }
}, {_id: false, collection: 'Prescription', minimize: false});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;

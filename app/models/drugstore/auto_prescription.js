// Buy medicine through clinic record
'use strict';

const mongoose = require('mongoose');
const autoPrescriptionSchema = mongoese.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    drugstoreId: mongoose.Schema.Types.ObjectId,
    recordId: mongoose.Schema.Types.ObjectId,
    note: String,
    image: {
        type: Array,
        maxLength: 5, 
    },
    medicine_list: Array, //list medicine ID
    medicine_price: Number,
    delivery_charge: Number,
    status: Int32, // 1: confirmed  2: delivered  3: received
    payment_method: {
        type: Int32, // 1: cash  2: digital wallet
        default: 1,
    }
}, {_id: false, collection: 'Auto_prescription', minimize: false});

const Auto_prescription = mongoose.model('Auto_prescription', autoPrescriptionSchema);

module.exports = Auto_prescription;

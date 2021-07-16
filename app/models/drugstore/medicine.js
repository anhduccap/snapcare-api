'use strict';

const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');
const medicineSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    medicine_name: String,
    medicine_category: Int32,
    price: {
        type: Int32,
        default: 0,
    },
    quantity: Int32,
    unit: String,
    mass: Number,
}, {_id: false, collection: 'Medicine', minimize: false});

const Medicine = mongoose.model('Medicine', medicineSchema);

module.exports = Medicine;

'use strict';

const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');
const healthbookSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    type: Int32,
    fullname: String,
    dob: Number,
    avatar: String,
    gender: Int32, //1: male, 2: female, 0: other
    phone: String,
    address: String,
    height: Int32, //centimeter
    weight: Int32, //grams
    symptom: String,
}, {_id: false, collection: 'Healthbook', minimize: false});

const Healthbook = mongoose.model('Healthbook', healthbookSchema);

module.exports = Healthbook;

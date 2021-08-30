'use strict';

const mongoose = require('mongoose');
const Int32 = require('mongoose-int32').loadType(mongoose);
const healthbookSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    id: String,
    userId: mongoose.Schema.Types.ObjectId,
    type: Int32,
    fullname: String,
    phone: String,
    dob: Number,
    age: Int32,
    avatar: {
        type: Object,
        default: {
            path: '',
        }
    },
    gender: Int32, //1-male 2-female 3-other
    address: Object,
    height: Int32, //centimeter
    weight: Int32, //grams

    symptom: String,

    date_created: {
        type: Number,
        default: Date.now(),
    },
    date_edited: {
        type: Number,
        default: null,
    },
}, {
    // _id: false,
    collection: 'Healthbook',
     minimize: false
});

const Healthbook = mongoose.model('Healthbook', healthbookSchema);

module.exports = Healthbook;

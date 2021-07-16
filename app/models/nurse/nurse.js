'use strict';

const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');
const nurseSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    fullname: String,
    introduction: String,
    gender: Int32, //1: male, 2: female, 0: other
    avatar: String,
    voted_num: {
        type: Number,
        default: 0,
    },
    university: Object,
    degree: String,
    skill_set: Array,
    specialized: Array,
    lang: Array,
    fee_per_hour: Int32,
}, {_id: false, collection: 'Nurse', minimize: false});

const Nurse = mongoose.model('Nurse', nurseSchema);

module.exports = Nurse;

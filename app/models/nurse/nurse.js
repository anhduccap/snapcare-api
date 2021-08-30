'use strict';

const mongoose = require('mongoose');
const Int32 = require('mongoose-int32').loadType(mongoose);
const nurseSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    fullname: String,
    introduction: String,
    gender: Int32, //1: male, 2: female, 0: other
    avatar: {
        type: Object,
        default: {
            path: '',
        }
    },
    
    department: Array,
    skill_set: Array,

    college: Object,

    lang: Array,
    fee_per_hour: Int32,

    average_score: {
        type: Number,
        default: 0,
    },

    is_active: {
        type: Boolean,
        default: true,
    },
    is_booked: {
        type: Boolean,
        default: false,
    },
}, {
    // _id: false, 
    collection: 'Nurse', 
    minimize: false});

const Nurse = mongoose.model('Nurse', nurseSchema);

module.exports = Nurse;

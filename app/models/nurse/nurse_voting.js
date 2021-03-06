'use strict';

const mongoose = require('mongoose');
const Int32 = require('mongoose-int32').loadType(mongoose);
const nurseVotingSchema = mongoose.Schema({
    healthbook: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Healthbook',
    },
    nurse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Nurse',
    },

    content: String,
    score: Int32,

    date_created: {
        type: Number,
        default: Date.now(),
    },
    date_edited: {
        type: Number,
        default: null,
    },
});

module.exports = mongoose.model('Nurse_voting', nurseVotingSchema);

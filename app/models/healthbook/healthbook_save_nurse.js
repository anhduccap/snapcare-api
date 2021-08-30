'use strict';

const mongoose = require('mongoose');
const nurseVotingSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    healthbookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Healthbook',
    },
    nurseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Nurse',
    },
    date_created: {
        type: Number,
        default: Date.now(),
    },
    date_edited: {
        type: Number,
        default: null,
    },
    status: Boolean, //true: saved  -  false: none
}, {
    // _id: false, 
    collection: 'Healthbook_save_nurse', 
    minimize: false});

const Healthbook_save_nurse = mongoose.model('Healthbook_save_nurse', nurseVotingSchema);

module.exports = Healthbook_save_nurse;

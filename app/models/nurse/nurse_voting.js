'use strict';

const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');
const nurseVotingSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    healthbookId: mongoose.Schema.Types.ObjectId,
    nurseId: mongoose.Schema.Types.ObjectId,
    date_created: Number,
    voted_comment: String,
    voted_score: Int32,
}, {_id: false, collection: 'Nurse_voting', minimize: false});

const Nurse_voting = mongoose.model('Nurse_voting', nurseVotingSchema);

module.exports = Nurse_voting;

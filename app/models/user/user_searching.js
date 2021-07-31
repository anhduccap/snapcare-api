'use strict';

const mongoose = require('mongoose');
const userSearchingSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    keyword: String,
    date_created: Number,
}, {_id: false, collection: 'User_searching', minimize: false});

const User_searching = mongoose.model('User_searching', userSearchingSchema);

module.exports = User_searching;
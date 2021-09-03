'use strict';

const mongoose = require('mongoose');
const userSearchingSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    keyword: String,
    date_created: Number,
}, {
    collection: 'Searching_keyword',
    minimize: false
});

module.exports = mongoose.model('Searching_keyword', userSearchingSchema);

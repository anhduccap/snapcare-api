'use strict';

const mongoose = require('mongoose');
const healthbookCreatingSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    healthBookId: mongoose.Schema.Types.ObjectId,
    date_created: Number,
}, {_id: false, collection: 'Healthbook_creating', minimize: false});

const Healthbook_creating = mongoose.model('Healthbook_creating', healthbookCreatingSchema);

module.exports = Healthbook_creating;

'use strict';

const mongoose = require('mongoose');
const drugstoreSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    store_name: String,
    logo: {
        type: String,
        default: '',
    },
    address: String,
    lat: Number,
    lon: Number,
    albums: Array,
    active_time: Object,
}, {_id: false, collection: 'Drugstore', minimize: false});

const Drug_store = mongoose.model('Drugstore', drugstoreSchema);

module.exports = Drug_store;

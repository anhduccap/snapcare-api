'use strict';

const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');
const areaCodeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    code: {
        type: Int32,
        default: 0,
    },
    area_name: String,
}, {_id: flase, collection: 'Area', minimize: flase});

const Area = mongoose.model('Area', areaCodeSchema);

module.exports = Area;

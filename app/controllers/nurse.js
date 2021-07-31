const NurseSchema = require('../models/nurse/nurse');

async function getAllNurse () {
    return await NurseSchema.find({}, (err) => {throw err;});
}

async function getNurseById (nurseId) {
    return await NurseSchema.find({_id: nurseId}, (err) => {throw err;});
}

exports.getAllNurse = async function (req, res, next) {
    getAllNurse();
}

exports.getNurseById = async function (req, res, next) {
    getNurseById(req.params.id);
}

exports.booking = async function (req, res, next) {
    
}

exports.voting = async function (req, res, next) {
    
}

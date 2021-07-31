const ClinicSchema = require('../models/clinic/clinic');
const ServiceSchema = require('../models/clinic/clinic_service');
const HealthbookSchema = require('../models/healthbook/healthbook');

async function getService(clinicId) {
    return await ServiceSchema.find({clinicId: clinicId}, (err) => {throw err;});
}

async function createRecord(clinicId, healthbookId) {

}

exports.getAllClinic = async function (req, res, next) {

}

exports.getClinicById = async function (req, res, next) {
    
}

exports.booking = async function (req, res, next) {

}

const mongoose = require('mongoose');

const SearchSchema = require('../../models/user/user_searching');

const ClinicSchema = require('../../models/clinic/clinic');
const DrugstoreSchema = require('../../models/drugstore/drugstore');
const HealthbookSchema = require('../../models/healthbook/healthbook');
const NurseSchema = require('../../models/nurse/nurse');

exports.getSearchResult = async (keyword) => {
    let pattern = new RegExp(keyword, 'i');

    let matchClinic = ClinicSchema.find({ clinic_name: {$regex: pattern} }, (err) => {
        if(err) { throw err; }
    });
    let matchDrugstore = DrugstoreSchema.find({ store_name: {$regex: pattern} }, (err) => {
        if(err) { throw err; }
    });
    let matchHealthbook = HealthbookSchema.find({ fullname: {$regex: pattern} }, (err) => {
        if(err) { throw err; }
    });
    let matchNurse = NurseSchema.find({ fullname: {$regex: pattern} }, (err) => {
        if(err) { throw err; }
    });
    
    let result = {
        Clinic: matchClinic,
        Drugstore: matchDrugstore,
        Healthbook: matchHealthbook,
        Nurse: matchNurse,
    };

    return result;
}

exports.updateSearchKeyword = async (userId, keyword) => {
    let newSearchRecord = new SearchSchema();
    newSearchRecord._id = new mongoose.Types.ObjectId();
    newSearchRecord.userId = userId;
    newSearchRecord.keyword = keyword;
    let date_created = Date.now();
    newSearchRecord.date_created = new Date(date_created).getTime();

    newSearchRecord.save((err) => {
        if(err) { throw err; }
    });
}

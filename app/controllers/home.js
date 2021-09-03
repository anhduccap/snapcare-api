const helper = require('../helper/index');

const NurseSchema = require('../models/nurse/nurse');
const HealthbookSchema = require('../models/healthbook/healthbook');
const ClinicSchema = require('../models/clinic/clinic');
const DrugstoreSchema = require('../models/drugstore/drugstore');

const CountrySchema = require('../models/user/address/country');
const ProvinceSchema = require('../models/user/address/province');
const DistrictSchema = require('../models/user/address/district');
const WardSchema = require('../models/user/address/ward');
const SearchSchema = require('../models/user/user_searching');

// [GET] /
exports.index = async function(req, res, next) {
    // let logged_user_id =  await authMiddleware(req, res, next, false);

    // if(logged_user_id === null || typeof logged_user_id !== 'string') {
    //     logged_user_id = null;
    // }

    res.send('Home page');
}

//[gET] /search/history
exports.searchingHistory = async function(req, res, next){
    let searchList = await SearchSchema.find({user: req.userId}).sort({ 'date_created': 'desc' }).limit(5);

    Promise.all(
        searchList.map( search => {
            search.keyword = unescape(search.keyword);
            return search;
        })
    ).then( searchList => {
        let data = [];
        if(!searchList || searchList.length === 0) {
            data = [];
        }
        else {
            data = searchList;
        }
        return res.status(200)
            .send( helper.responseSuccess(true, '200', 'OK', data) );
    }).catch( error => {
        return res.status(500) 
            .send( helper.responseFailure(false, '500', 'Error', error) );
    })
}

// [GET] /search/:keyword
exports.search = async function(req, res, next) {

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

    //update keyword
    let newSearchRecord = new SearchSchema();
    newSearchRecord._id = new mongoose.Types.ObjectId();
    newSearchRecord.userId = userId;
    newSearchRecord.keyword = keyword;
    let date_created = Date.now();
    newSearchRecord.date_created = new Date(date_created).getTime();

    newSearchRecord.save((err) => {
        if(err) { throw err; }
    });
    
    console.log(req.query.keyword);
    res.json(searchResults(req.query.keyword));
}

//[GET] /suggest_keyword
exports.suggestKeyword = async function (req, res, next) {

}

exports.getAddress = async function (req, res, next) {
    let provinceList = await ProvinceSchema.find({}).populate({
        path: 'country',
    }).exec();
    
    return res.status(200)
        .send( helper.responseSuccess(true, '200', 'OK', provinceList))
}

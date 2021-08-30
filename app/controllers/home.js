const helper = require('../helper/index');

const NurseSchema = require('../models/nurse/nurse');
const HealthbookSchema = require('../models/healthbook/healthbook');
const ClinicSchema = require('../models/clinic/clinic');
const DrugstoreSchema = require('../models/drugstore/drugstore');

const CountrySchema = require('../models/user/address/country');
const ProvinceSchema = require('../models/user/address/province');
const DistrictSchema = require('../models/user/address/district');
const WardSchema = require('../models/user/address/ward');

// [GET] /
exports.index = async function(req, res, next) {
    // let logged_user_id =  await authMiddleware(req, res, next, false);

    // if(logged_user_id === null || typeof logged_user_id !== 'string') {
    //     logged_user_id = null;
    // }

    res.send('Home page');
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
    let countryList = await CountrySchema.find({});
    let provinceList = await ProvinceSchema.find({});
    let districtList = await DistrictSchema.find({});
    let wardList = await WardSchema.find({});

    countryList.forEach((country) => {
        let matchProvinceList = provinceList.filter((province, index) => {
            return province.countryCode === country.code;
        });
        country.provinces = matchProvinceList;
        country.provinces.forEach((province) => {
            let matchDistrictList = districtList.filter((district, index) => {
                return district.provinceCode === province.code;
            });
            province.districts = matchDistrictList;
            province.districts.forEach((district) => {
                let matchWardList = wardList.filter((ward, index) => {
                    return ward.districtCode === district.code;
                });
                district.wards = matchWardList;
            })
        });
    });
    return countryList;
}

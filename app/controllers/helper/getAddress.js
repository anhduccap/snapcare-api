const CountrySchema = require('../../models/user/address/country');
const ProvinceSchema = require('../../models/user/address/province');
const DistrictSchema = require('../../models/user/address/district');
const WardSchema = require('../../models/user/address/ward');

exports.getAddress = async () => {
    let countryList = await CountrySchema.find({})
        .catch(error => { throw error});
    let provinceList = await ProvinceSchema.find({})
        .catch(error => { throw error});
    let districtList = await DistrictSchema.find({})
        .catch(error => { throw error});
    let wardList = await WardSchema.find({})
        .catch(error => { throw error});

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
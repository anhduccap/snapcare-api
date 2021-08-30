'use strict';

const CountrySchema = require('../models/user/address/country');
const ProvinceSchema = require('../models/user/address/province');
const DistrictSchema = require('../models/user/address/district');
const WardSchema = require('../models/user/address/ward');

exports.responseSuccess = (success = true, code = '0', message = '', data = {}) => {
    return {
        'success': success,
        'code': code,
        'message': message,
        'data': data,
    };
}

exports.responseFailure = (success = false, code = '0', message = '', errors = {}) => {
    return {
        'success': success,
        'code': code,
        'message': message,
        'errors': errors,
    };
}

exports.standardizePhoneNumber = (phoneNumber) => {
    if(phoneNumber.startsWith('+84')) {
        phoneNumber = '0' + phoneNumber.substring(3);
    } else if(phoneNumber.startsWith('84')) {
        phoneNumber = '0' + phoneNumber.substring(2);
    } else if(phoneNumber.length === 9 && phoneNumber[0] !== '0') {
        phoneNumber = '0' + phoneNumber;
    }
    return phoneNumber;
}

exports.internationalPhoneNumber = (phoneNumber) => {
    if(phoneNumber.startsWith('+84')) {
        phoneNumber = phoneNumber.substring(1);
    } else if(phoneNumber.length === 9 && phoneNumber[0] !== '0') {
        phoneNumber = '84' + phoneNumber;
    } else if(phoneNumber.length === 10 && phoneNumber[0] === '0') {
        phoneNumber = '84' + phoneNumber.substring(1);
    }
    return phoneNumber;
}

exports.addressDetail = async (country_code, province_code, district_code, ward_code, details) => {
    const country = await CountrySchema.findOne({code: country_code});
    const province = await ProvinceSchema.findOne({code: province_code});
    const district = await DistrictSchema.findOne({code: district_code});
    const ward = await WardSchema.findOne({code: ward_code});

    return `${details}, ${ward.prefix} ${ward.name}, ${district.prefix} ${district.name}, ${province.name}, ${country.name}`;
}

exports.getAge = (year, month, day) => {
    let dob = new Date(year, month-1, day);
    let now = new Date();
    return now.getFullYear() - dob.getFullYear();
}

exports.standardizeDate = (hour, min, sec, day, month, year) => {
    if(hour < 10) hour = `0${hour}`;
    if(min < 10) min = `0${min}`;
    if(sec < 10) sec = `0${sec}`;
    if(day < 10) day = `0${day}`;
    if(month < 10) month = `0${month}`;
    return `${hour}:${min}:${sec} ${day}/${month}/${year}`;
}

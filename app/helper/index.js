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

exports.removeVietnameseTones = (str) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str = str.replace(/đ/g,"d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g," ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
    return str;
}

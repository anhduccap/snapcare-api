'use strict';

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

const addressHelper = require('./helper/getAddress');

exports.getLogin = async function (req, res, next) {
    res.send('Login page');
}

exports.postLogin = async function (req, res, next) {
    
}

exports.getRegister = async function (req, res, next) {
    // let addressList = await addressHelper.getAddress()
    //     .catch(err => { throw err});
    // res.json(addressList);
    res.send('Register page');
}

exports.postRegister = async function (req, res, next) {

}

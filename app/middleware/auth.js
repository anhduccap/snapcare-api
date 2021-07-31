const UserSchema = require('../models/user/user');

module.exports = async (req, res, next, is_require_login) => {
    if(is_require_login === undefined) is_require_login = true;
    if(is_require_login) {
        return res.status(403).send('Authentication failed');
    }

    let user = UserSchema.findOne({
        //test
    }, (err) => {throw err;});

    if(user !== null) return user._id;

    return null;
}
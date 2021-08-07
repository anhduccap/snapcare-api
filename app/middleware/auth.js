const jwt = require('jsonwebtoken');
const helper = require('../controllers/helper/index');

exports.verifyToken = async function(req, res, next) {
    const token = req.header('auth-token');

    if(!token) {
        return res
            .status(403)
            .send( helper.responseFailure(false, '403', 'Access denied') );
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        req.userId = verified.id;
        return next();

    } catch (err) {
        return res
            .status(403)
            .send( helper.responseFailure(false, '403', 'Invalid token') );
    }
}

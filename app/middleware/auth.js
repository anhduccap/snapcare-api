const jwt = require('jsonwebtoken');
const helper = require('../helper/index');

exports.verifyToken = async function(req, res, next) {
    const token = req.header('auth-token');

    if(!token) {
        return res
            .status(403)
            .send( helper.responseFailure(false, '403', 'Access denied') );
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        req.userId = verified.data.userId;
        return next();

    } catch (err) {
        return res
            .status(403)
            .send( helper.responseFailure(false, '403', 'Invalid token') );
    }
}

exports.verifyHealthbook = async function (req, res, next) {
    const healthbookId = req.header('healthbook-id');

    if(!healthbookId) {
        return res
            .status(403)
            .send( helper.responseFailure(false, '403', 'Invalid health book! Please try to choose another health book') );
    }

    req.healthbookId = healthbookId;
    return next();
}

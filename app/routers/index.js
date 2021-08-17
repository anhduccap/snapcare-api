'use strict';

const express = require('express');
const router = express.Router();

const helper = require('../controllers/helper/index');

const home = require('./home');
const auth = require('./auth');
const nurse = require('./nurse');
const clinic = require('./clinic');
const drugstore = require('./drugstore');
const healthbook = require('./healthbook');

router.use('/', home);
router.use('/auth', auth);
router.use('/nurse', nurse);
router.use('/clinic', clinic);
router.use('/drugstore', drugstore);
router.use('/healthbook', healthbook);

// catch 404 and forward to error handler
router.use(function(req, res) {
    res
        .status(404)
        .send( helper.responseFailure(false, '404', 'Page not found', {url: req.originalUrl + ' not found'}) );
});

// Error handle
router.use(function(err, req, res, next) {
    const _status = err.status || 500;
    res.status(_status);
    res.render('error', helper.responseFailure(false, `${_status}`, err.message, {}));
});

module.exports = router;

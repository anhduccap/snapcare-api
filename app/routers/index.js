'use strict';

const express = require('express');
const router = express.Router();

const home = require('./home');
const auth = require('./auth');
const nurse = require('./nurse');
const clinic = require('./clinic');
const drugstore = require('./drugstore');
const healthbook = require('./healthbook');

app.use('/', home);
app.use('/auth', auth);
app.use('/nurse', nurse);
app.use('/clinic', clinic);
app.use('/drugstore', drugstore);
app.use('/healthbook', healthbook);

// catch 404 and forward to error handler
router.use(function(req, res) {
    res.status(404).send(helper.responseError( helper.httpsCode().NOT_FOUND, {url: req.originalUrl + ' not found'},'Page not found'))
});

// Error handle
router.use(function(err, req, res, next) {
    const _status = err.status || 500;
    res.status(_status);
    res.render('error', helper.responseError(helper.httpsCode().INTERNAL_SERVER_ERROR,err.message));
});

module.exports = router;

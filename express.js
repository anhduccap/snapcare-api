const helmet = require('helmet');
const expressValidator = require('express-validator');
const indexRouter = require('./app/routers/index');

const express = require('express');
const app = express();

exports.init = async function(app) {
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    // app.use(expressValidator());

    app.use(async function(req, res, next) {
        
    })

    app.use('/', indexRouter);
}
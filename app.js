const express = require('express');
const app = express();
require('dotenv').config();
const logger = require('morgan');
const helmet = require('helmet');
const expressValidator = require('express-validator');
// const server = require('http').createServer(app);
// const expressInit = require('./express');

// const indexRouter = require('./app/routers/index');
const home = require('./app/routers/home');
const auth = require('./app/routers/auth');
const nurse = require('./app/routers/nurse');
const clinic = require('./app/routers/clinic');
const drugstore = require('./app/routers/drugstore');
const healthbook = require('./app/routers/healthbook');

app.use(logger('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const mongoose = require('mongoose');
mongoose.connect(
    process.env.MONGODB,
    {useNewUrlParser: true, useUnifiedTopology: true},
    (err) => {
        if(err) throw err;
        console.log('Connecting to mongoose successfully');
    }
);

// app.use('/', indexRouter);
app.use('/', home);
app.use('/auth', auth);
app.use('/nurse', nurse);
app.use('/clinic', clinic);
app.use('/drugstore', drugstore);
app.use('/healthbook', healthbook);

// catch 404 and forward to error handler
app.use(function(req, res) {
    // res.status(404).send(helper.responseError( helper.httpsCode().NOT_FOUND, {url: req.originalUrl + ' not found'},'Page not found'))
    res.status(404).send('Errors');
});

// error handler
// app.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
  
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

// expressInit.init(app);
// module.exports = app;

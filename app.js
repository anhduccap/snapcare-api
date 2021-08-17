const express = require('express');
const app = express();
require('dotenv').config();
const logger = require('morgan');
const helmet = require('helmet');
const CORS = require('cors');

const routers = require('./app/routers/index');

app.use(logger('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const mongoose = require('mongoose');
mongoose.connect(
    process.env.MONGODB,
    {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false},
    (err) => {
        if(err) throw err;
        console.log('Connecting to mongoose successfully');
    }
);

app.use(CORS({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, x-token, Lang, Client',
    credentials: true,
}));

app.use('/', routers);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

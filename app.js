const express = require('express');
app = express();
const dotenv = require('dotenv');
dotenv.config();

const server = require('http').createServer(app);
const expressInit = require('./express');
const mongoose = require('mongoose');
mongoose.connect(
    process.env.MONGODB,
    {useNewUrlParser: true, useUnifiedTopology: true},
    (err) => {
        if(err) throw err;
        console.log('Connecting to mongoose successfully');
    }
);

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

expressInit.init(app);
module.exports = app;
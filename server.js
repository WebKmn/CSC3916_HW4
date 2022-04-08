/*
* CSC3916 HW 3
* File: server.js
* Desc: Scaffolding for Movie API
*/

const cors = require('cors'),
    express = require('express'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    app = express(),
    router = require('./routes/routes'),
    mongoose = require("mongoose");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

try{
    mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
        console.log('Connected to Database.');
    });
}catch (error) {
    console.log('Failed to connect to Database.');
}

app.use('/', router);
app.listen(process.env.PORT || 3000);
module.exports = app;
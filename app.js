var express = require('express');
require('dotenv').config();

const {connectToDatabase} = require("./database");
const {AppInitializer} = require("./init");

const app = express();

connectToDatabase()
    .then(() => {
        const initializer = new AppInitializer(app)
        initializer.init()
    })
    .catch(error => console.error(error))

module.exports = app;

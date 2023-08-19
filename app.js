const express = require("express");
const app = express();

const path = require('path');

var bodyParser = require("body-parser");
var cors = require("cors");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.json());
var mysql = require("mysql");
// Routes import

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', require('./routes/myapis'))

module.exports = app;
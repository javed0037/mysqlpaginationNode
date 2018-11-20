const express = require('express');
var Promise = require('bluebird');
const bcrypt = require('bcrypt');
var path = require('path');
const bodyparser = require('body-parser');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
var pagination = require('pagination')
const cors = require('cors');
var app = express();
var config = require('./lib/config/passpord_config');
var adminRoutes = require('./lib/route/adminRout')
var pamingaRouter = require('./lib/route/pamingaRoute')
app.use(cors());
app.use(bodyparser({ limit: '50mb' }))
app.use(bodyparser.urlencoded({ limit: '50mb' }));
app.use(bodyparser());
app.use(bodyparser.json());
require('dotenv').config();

app.use('/admin', adminRoutes);
app.use('/paminga', pamingaRouter);

app.use(express.static(path.join(__dirname, 'uploads')));

let port = process.env.PORT || 5000;
app.listen(port, function (req, res) {
  console.log("app is listen on the port no .......", port);
})
'use strict';

var api = require("express").Router();
var BGLd = require("./BGLd");

api.use('/bitcoind', BGLd);

module.exports = api;

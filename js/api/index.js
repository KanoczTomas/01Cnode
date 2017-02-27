'use strict';

var api = require("express").Router();
var bitcoind = require("./bitcoind");

api.use('/bitcoind', bitcoind);

module.exports = api;

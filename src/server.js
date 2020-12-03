require('dotenv').config();
const GirowebRestAPI = require('./girowebRestAPI');
const GirowebServiceFactory = require('./girowebServiceFactory');

const { test, prod } = require('../config/dbconfig.json');

const gwRestAPI = new GirowebRestAPI(test);

gwRestAPI.Start();

const GirowebRestAPI = require('./girowebRestAPI');
const GirowebServiceFactory = require('./girowebServiceFactory');

const {test, prod} = require('../config/dbconfig.json');

const gwServiceFactory = new GirowebServiceFactory(test);
const gwRestAPI = new GirowebRestAPI(gwServiceFactory);

gwRestAPI.Start();

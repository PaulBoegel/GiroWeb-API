const GirowebRestAPI = require('./girowebRestAPI');
const GirowebServiceFactory = require('./girowebServiceFactory');

const gwServiceFactory = new GirowebServiceFactory();
const gwRestAPI = new GirowebRestAPI(gwServiceFactory);

gwRestAPI.Start();

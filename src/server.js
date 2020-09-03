const GirowebServiceAPI = require('./girowebServiceAPI');
const GirowebRestAPI = require('./girowebRestAPI');

const gwServiceAPI = new GirowebServiceAPI();
const gwRestAPI = new GirowebRestAPI(gwServiceAPI);

gwRestAPI.Start();

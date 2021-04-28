require('dotenv').config();
const loggerConfig = require('./logger-config');
const logger = require('./logger/createWinston')(loggerConfig);
const GirowebRestAPI = require('./girowebRestAPI');
const GirowebServiceFactory = require('./girowebServiceFactory');
const { test, prod } = require('../config/dbconfig.json');

process.on('uncaughtException', (err) => {
  logger.error(err.stack, () => {
    process.exit(1);
  });
});

const gwRestAPI = new GirowebRestAPI(test);

gwRestAPI.Start();

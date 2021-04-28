require('dotenv').config();
const loggerConfig = require('./logger-config');
const logger = require('./logger/createWinston')(loggerConfig);
const GirowebRestAPI = require('./girowebRestAPI');

process.on('uncaughtException', (err) => {
  logger.error(err.stack, () => {
    process.exit(1);
  });
});

const gwRestAPI = new GirowebRestAPI();

gwRestAPI.Start();

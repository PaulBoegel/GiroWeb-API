appRoot = require('app-root-path');
module.exports = {
  file: {
    filename: `${appRoot}/log/service.log`,
    timestamp: true,
    handleExceptions: false,
    json: true,
    maxsize: 5242880, // 5MB
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: true,
    colorize: true,
  },
  dateFormat: 'YYYY-MM-DD HH:mm:ss',
};

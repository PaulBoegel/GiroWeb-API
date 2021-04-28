const winston = require('winston');
const { format, config } = require('winston');
const { combine, timestamp, json } = format;

function CreateWinston(options) {
  const logger = winston.createLogger({
    levels: config.syslog.levels,
    format: combine(timestamp({ format: options.dateFormat }), json()),
    transports: [
      new winston.transports.Console(options.console),
      new winston.transports.File(options.file),
    ],
  });
  return {
    info(message, callback = () => {}) {
      logger.log('info', message, () => {
        callback();
      });
    },
    error(message, callback = () => {}) {
      logger.log('error', message, () => {
        callback();
      });
    },
  };
}

module.exports = CreateWinston;

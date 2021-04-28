const winston = require('winston');
function CreateWinston() {
  const logger = winston.createLogger({
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
  });
  return {
    info(message) {
      logger.log('info', message);
    },
    error(message) {
      logger.log('error', message);
    },
  };
}

module.exports = CreateWinston;

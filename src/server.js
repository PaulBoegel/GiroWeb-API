const { processenv } = require('processenv');
const jwt = require('jsonwebtoken');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const CardServiceRouter = require('./router/cardServiceRouter');
const AuthenticationRouter = require('./router/authenticationRouter');
const AuthenticationController = require('./controller/authenticationController');
const AuthRepository = require('./repositories/authRepository');
const AuthMiddleware = require('./middleware/authMiddleware');
const cardService = require('./controller/card-service');
const createCallback = require('./express-callback');
const loggerConfig = require('./logger-config');
const logger = require('./logger/createWinston')(loggerConfig);

const apiRoot = processenv('API_ROOT') || 'api';

process.on('uncaughtException', (err) => {
  logger.error(err.stack, () => {
    process.exit(1);
  });
});

const app = express();
const port = processenv('PORT') || 3000;
const isAuthActive = processenv('AUTHENTICATION');

app.use(cors());
app.use(bodyParser.raw());
app.use(bodyParser.json());

const authRepository = AuthRepository();
const authMiddleware = AuthMiddleware(jwt, isAuthActive);

const authenticationController = new AuthenticationController({
  jwt,
  authRepository,
});
const authenticationRouter = new AuthenticationRouter(
  express.Router(),
  authenticationController
);

const cardServiceRouter = new CardServiceRouter(
  express.Router(),
  authMiddleware,
  cardService,
  createCallback
);

app.use(`/${apiRoot}`, authenticationRouter);
app.use(`/${apiRoot}`, cardServiceRouter);

app.listen(port, () => {
  console.log(`GiroWeb Rest API listening on Port ${port}`);
});

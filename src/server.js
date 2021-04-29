require('dotenv').config();
const loggerConfig = require('./logger-config');
const logger = require('./logger/createWinston')(loggerConfig);
const jwt = require('jsonwebtoken');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const GirowebServiceFactory = require('./girowebServiceFactory');
const CardServiceRouter = require('./router/cardServiceRouter');
const AuthenticationRouter = require('./router/authenticationRouter');
const CardServiceController = require('./controller/cardServiceController');
const AuthenticationController = require('./controller/authenticationController');
const AuthRepository = require('./repositories/authRepository');
const AuthMiddleware = require('./middleware/authMiddleware');

process.on('uncaughtException', (err) => {
  logger.error(err.stack, () => {
    process.exit(1);
  });
});

const app = express();
const port = process.env.PORT || 3000;

const serviceFactory = new GirowebServiceFactory();
const authRepository = AuthRepository();
const authMiddleware = AuthMiddleware(jwt);

app.use(cors());
app.use(bodyParser.raw());
app.use(bodyParser.json());

const authenticationController = new AuthenticationController({
  jwt,
  authRepository,
});
const authenticationRouter = new AuthenticationRouter(
  express.Router(),
  authenticationController
);

app.use('/api', authenticationRouter);

const cardServiceController = new CardServiceController(serviceFactory);
const cardServiceRouter = new CardServiceRouter(
  express.Router(),
  authMiddleware,
  cardServiceController
);

app.use('/api', cardServiceRouter);

app.listen(port, () => {
  console.log(`GiroWeb Rest API listening on Port ${port}`);
});

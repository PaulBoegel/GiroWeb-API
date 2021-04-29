require('dotenv').config();
const loggerConfig = require('./logger-config');
const logger = require('./logger/createWinston')(loggerConfig);
const jwt = require('jsonwebtoken');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ServiceFactory = require('./serviceFactory');
const CardServiceRouter = require('./router/cardServiceRouter');
const AuthenticationRouter = require('./router/authenticationRouter');
const CardServiceController = require('./controller/cardServiceController');
const AuthenticationController = require('./controller/authenticationController');
const AuthRepository = require('./repositories/authRepository');
const AuthMiddleware = require('./middleware/authMiddleware');
const TransactionRepository = require('./repositories/transactionRepository');
const BillStockRepository = require('./repositories/billStockRepository');
const BillAssumtionRepository = require('./repositories/billAssumtionRepository');
const BillTakingRepository = require('./repositories/billTakingRepository');

process.on('uncaughtException', (err) => {
  logger.error(err.stack, () => {
    process.exit(1);
  });
});

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.raw());
app.use(bodyParser.json());

const serviceRepos = {
  transRepo: TransactionRepository(),
  billStockRepo: BillStockRepository(),
  billTakingRepo: BillTakingRepository(),
  billAssumtionRepo: BillAssumtionRepository(),
};
const serviceFactory = new ServiceFactory(serviceRepos);

const authRepository = AuthRepository();
const authMiddleware = AuthMiddleware(jwt);

const authenticationController = new AuthenticationController({
  jwt,
  authRepository,
});
const authenticationRouter = new AuthenticationRouter(
  express.Router(),
  authenticationController
);

const cardServiceController = new CardServiceController(serviceFactory);
const cardServiceRouter = new CardServiceRouter(
  express.Router(),
  authMiddleware,
  cardServiceController
);

app.use('/api', authenticationRouter);
app.use('/api', cardServiceRouter);

app.listen(port, () => {
  console.log(`GiroWeb Rest API listening on Port ${port}`);
});

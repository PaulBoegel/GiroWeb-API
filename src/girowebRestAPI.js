const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const CardServiceController = require('./controller/cardServiceController');
const AuthenticationController = require('./controller/authenticationController');
const CardServiceRouter = require('./router/cardServiceRouter');
const AuthenticationRouter = require('./router/authenticationRouter');

function GirowebRestAPI(serviceFactory) {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(cors());
  app.use(bodyParser.raw());
  app.use(bodyParser.json());

  function InitAuthentication() {
    const authenticationController = new AuthenticationController();
    const authenticationRouter = new AuthenticationRouter(
      express.Router(),
      authenticationController
    );

    app.use('/api', authenticationRouter);
  }

  function InitCardServices() {
    const cardServiceController = new CardServiceController(serviceFactory);
    const cardServiceRouter = new CardServiceRouter(
      express.Router(),
      cardServiceController
    );

    app.use('/api', cardServiceRouter);
  }

  function Start() {
    InitAuthentication();
    InitCardServices();
    app.listen(port, () => {
      console.log(`GiroWeb Rest API listening on Port ${port}`);
    });
  }

  return { Start };
}

module.exports = GirowebRestAPI;

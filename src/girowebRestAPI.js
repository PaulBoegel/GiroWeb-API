const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const CardServiceController = require('./controller/cardServiceController');
const CardServiceRouter = require('./router/cardServiceRouter');

function GirowebRestAPI(gwServiceAPI) {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(cors());
  app.use(bodyParser.raw());
  app.use(bodyParser.json());

  function InitCardServices() {
    const cardServiceController = new CardServiceController(gwServiceAPI);
    const cardServiceRouter = new CardServiceRouter(
      express.Router(),
      cardServiceController
    );

    app.use('/api', cardServiceRouter);
  }

  function Start() {
    InitCardServices();
    app.listen(port, () => {
      console.log(`GiroWeb Rest API listening on Port ${port}`);
    });
  }

  return { Start };
}

module.exports = GirowebRestAPI;

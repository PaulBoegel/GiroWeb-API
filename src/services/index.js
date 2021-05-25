const { processenv } = require('processenv');
const { MongoClient } = require('mongodb');
const serviceFactory = require('./serviceFactory');
const helloTessService = require('./helloTessService');
const TransactionRepository = require('../repositories/transactionRepository');
const BillStockRepository = require('../repositories/billStockRepository');
const BillAssumptionRepository = require('../repositories/billAssumptionRepository');
const BillTakingRepository = require('../repositories/billTakingRepository');

const host = processenv('DB_HOST');
const port = processenv('DB_PORT');
const dbName = processenv('DB_NAME');
const url = `mongodb://${host}:${port}`;

let db;
let connection;

async function makeDb() {
  connection =
    connection ||
    (await MongoClient.connect(url, {
      useUnifiedTopology: true,
    }));
  db = await connection.db(dbName);
  return db;
}

const transRepo = TransactionRepository({ makeDb });
const billStockRepo = BillStockRepository({ makeDb });
const billAssumptionRepo = BillAssumptionRepository({ makeDb });
const billTakingRepo = BillTakingRepository({ makeDb });

const services = {
  HelloTess: helloTessService,
};

module.exports = serviceFactory({
  services,
  transRepo,
  billStockRepo,
  billAssumptionRepo,
  billTakingRepo,
});

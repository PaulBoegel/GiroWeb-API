const serviceFactory = require('./serviceFactory');
const helloTessService = require('./helloTessService');
const TransactionRepository = require('../repositories/transactionRepository');
const BillStockRepository = require('../repositories/billStockRepository');
const BillAssumptionRepository = require('../repositories/billAssumptionRepository');
const BillTakingRepository = require('../repositories/billTakingRepository');

const makeDb = {};
const transRepo = TransactionRepository({ makeDb });
const billStockRepo = BillStockRepository({ makeDb });
const billAssumptionRepo = BillAssumptionRepository({ makeDb });
const billTakingRepo = BillTakingRepository({ makeDb });

const services = {
  helloTess: helloTessService,
};

module.exports = serviceFactory({
  network,
  services,
  transRepo,
  billStockRepo,
  billAssumptionRepo,
  billTakingRepo,
});

function network() {
  return {
    send: () => {
      return true;
    },
  };
}

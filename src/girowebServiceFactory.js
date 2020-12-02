const TestService = require('./services/testService');
const HelloTessService = require('./services/helloTessService');
const TransactionRepository = require('./repositories/transactionRepository');
const BillStockRepository = require('./repositories/billStockRepository');
const BillAssumtionRepository = require('./repositories/billAssumtionRepository');
const BillTakingRepository = require('./repositories/billTakingRepository');

function GirowebServiceFactory(dbConfig) {
  
  function CreateService(key) {
    const transRepo = TransactionRepository(dbConfig);
    const billStockRepo = BillStockRepository(dbConfig);
    const billTakingRepo = BillTakingRepository(dbConfig);
    const billAssumtionRepo = BillAssumtionRepository(dbConfig);
    const params = {transRepo, billStockRepo, billAssumtionRepo, billTakingRepo}
    switch (key) {
      case 'HelloTess':
        return new HelloTessService(params);
      case 'Test':
        return new TestService(params);
      default:
        return null;
    }
  }

  return { CreateService };
}

module.exports = GirowebServiceFactory;

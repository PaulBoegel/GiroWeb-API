const TestService = require('./services/testService');
const HelloTessService = require('./services/helloTessService');
const TransactionRepository = require('./repositories/transactionRepository');
const CashQuantityRepository = require('./repositories/cashQuantityRepository');
const BillStockRepository = require('./repositories/billStockRepository');

function GirowebServiceFactory(dbConfig) {
  
  function CreateService(key) {
    const transRepo = TransactionRepository(dbConfig);
    const cashQuantityRepo = CashQuantityRepository(dbConfig);
    const billStockRepo = BillStockRepository(dbConfig);
    const params = {transRepo, cashQuantityRepo, billStockRepo}
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

const GirowebServiceFactory = require('./girowebServiceFactory');

function GirowebServiceAPI() {
  const factory = GirowebServiceFactory();

  function SaveTransaction(serviceKey, transaction) {
    const service = factory.CreateService(serviceKey);
    service.SaveTransaction(transaction);
  }

  return { SaveTransaction };
}

module.exports = GirowebServiceAPI;

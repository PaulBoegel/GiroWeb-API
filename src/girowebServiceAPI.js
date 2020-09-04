const GirowebServiceFactory = require('./girowebServiceFactory');

function GirowebServiceAPI() {
  const factory = GirowebServiceFactory();

  async function SaveTransaction(serviceKey, machineID, transaction) {
    const service = factory.CreateService(serviceKey);
    if (service === undefined) {
      throw new Error(500);
    }
    const response = await service.SaveTransaction(machineID, transaction);

    return response;
  }

  return { SaveTransaction };
}

module.exports = GirowebServiceAPI;

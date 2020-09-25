function CardServiceController(serviceFactory) {

  function GetService(serviceKey){
    const service = serviceFactory.CreateService(serviceKey);
    if (service === undefined) {
      throw new Error(500);
    }
    return service;
  }

  async function SaveTransaction(req, res) {
    try {
      const { serviceKey, machineID, transaction } = req.body;
      const response = await GetService(serviceKey).SaveTransaction(
        machineID,
        transaction
      );
      res.send(response);
    } catch (err) {
      res.sendStatus(err.message);
    }
  }

  async function SaveCashQuantities(req, res) {
    try {
      const { serviceKey, machineID, cashQuantities } = req.body;
      const response = await GetService(serviceKey).SaveCashQuantities(
        machineID,
        cashQuantities
      );
      res.send(response);
    } catch(err){
      res.sendStatus(err.message);
    }
  }

  return { SaveTransaction, SaveCashQuantities };
}

module.exports = CardServiceController;

function CardServiceController(serviceFactory) {
  function GetService(serviceKey) {
    const service = serviceFactory.CreateService(serviceKey);
    if (service === undefined) {
      throw new Error(500);
    }
    return service;
  }

  async function SaveTransaction(req, res) {
    try {
      const { serviceKey } = req.body;
      const response = await GetService(serviceKey).SaveTransaction(req.body);
      res.send(response);
    } catch (err) {
      res.sendStatus(err.message);
    }
  }

  async function SendCashQuantities(req, res) {
    try {
      const cashQuantities = req.body;
      const response = await GetService(
        cashQuantities.serviceKey
      ).SendCashQuantities(cashQuantities);
      res.send(response);
    } catch (err) {
      res.sendStatus(err.message);
    }
  }

  return { SaveTransaction, SendCashQuantities };
}

module.exports = CardServiceController;

function CardServiceController(serviceFactory) {
  function GetErrorCode(error) {
    let code = parseInt(error.message, 10);
    if (Number.isNaN(code)) code = 500;
    return code;
  }

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
      await GetService(serviceKey).SaveTransaction(req.body);
      res.send(200);
    } catch (err) {
      const code = GetErrorCode(err);
      res.sendStatus(GetErrorCode(code));
    }
  }

  async function SaveBillTaking(req, res){
    try {
      const { serviceKey } = req.body;
      await GetService(serviceKey).SaveBillTaking(req.body);
      res.send(200);
    } catch(err){
      const code = GetErrorCode(err);
      res.sendStatus(GetErrorCode(code));
    }
  }

  async function SendCashQuantities(req, res) {
    try {
      const cashQuantities = req.body;
      await GetService(cashQuantities.serviceKey).SendCashQuantities(
        cashQuantities
      );
      res.send(200);
    } catch (err) {
      const code = GetErrorCode(err);
      res.sendStatus(GetErrorCode(code));
    }
  }

  return { SaveTransaction, SaveBillTaking, SendCashQuantities };
}

module.exports = CardServiceController;

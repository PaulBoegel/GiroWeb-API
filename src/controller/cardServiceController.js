function CardServiceController(serviceAPI) {
  async function SaveTransaction(req, res) {
    try {
      const { serviceKey, machineID, transaction } = req.body;
      const response = await serviceAPI.SaveTransaction(
        serviceKey,
        machineID,
        transaction
      );
      res.send(response);
    } catch (err) {
      res.sendStatus(err.message);
    }
  }

  return { SaveTransaction };
}

module.exports = CardServiceController;

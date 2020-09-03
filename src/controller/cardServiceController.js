function CardServiceController(serviceAPI) {
  async function SaveTransaction(req, res) {
    try {
      const { serviceKey, transaction } = req.body;
      await serviceAPI.SaveTransaction(serviceKey, transaction);
      res.sendStatus(202);
    } catch (err) {
      res.sendStatus(500);
    }
  }

  return { SaveTransaction };
}

module.exports = CardServiceController;

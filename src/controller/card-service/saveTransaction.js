module.exports = function createSaveTransaction({ createService }) {
  return async function saveTransaction(request) {
    const headers = {
      'Content-Type': 'application/json',
    };
    try {
      const { serviceKey } = request.body;
      const service = await createService(serviceKey);
      const transaction = await service.SaveTransaction(request.body);

      await service.IncreaseBillAssumption({
        ...transaction.getKeys(),
        ...transaction.getData(),
      });

      return {
        headers,
        statusCode: 200,
        body: {
          ...transaction.getKeys(),
          ...transaction.getData(),
        },
      };
    } catch (error) {
      return {
        headers,
        statusCode: 400,
        body: {
          error: error.message,
        },
      };
    }
  };
};

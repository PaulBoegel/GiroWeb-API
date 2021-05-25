module.exports = function createSendBillTaking({ createService }) {
  return async function sendBillTaking(request) {
    const headers = {
      'Content-Type': 'application/json',
    };
    try {
      const { serviceKey, machineId, cashQuantities } = request.body;
      const service = createService(serviceKey);
      const saveBillTakingPromises = [];

      cashQuantities.forEach((quantity) => {
        saveBillTakingPromises.push(
          service.SaveBillTaking({
            serviceKey,
            machineId,
            ...quantity,
          })
        );
      });

      const [billTakings] = await Promise.all(saveBillTakingPromises);

      return {
        headers,
        statusCode: 200,
        body: {
          ...billTakings.getKeys(),
          ...billTakings.getData(),
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

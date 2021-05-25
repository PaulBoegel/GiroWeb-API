module.exports = function createSendCashQuantities({
  createService,
}) {
  return async function sendCashQuantities(request) {
    const headers = {
      'Content-Type': 'application/json',
    };
    try {
      const { serviceKey, machineId, cashQuantities } = request.body;
      const service = createService(serviceKey);
      const saveQuantityPromises = [];

      cashQuantities.forEach(async (quantity) => {
        saveQuantityPromises.push(
          service.SaveBillStock({
            serviceKey,
            machineId,
            ...quantity,
          })
        );
      });

      await Promise.all(saveQuantityPromises);
      const billingData = await service.GetBillingData(machineId);
      return {
        headers,
        statusCode: 200,
        body: {
          ...billingData,
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

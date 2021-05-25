module.exports = function createSaveTransaction({ createService }) {
  return async function saveTransaction(request) {
    const headers = {
      'Content-Type': 'application/json',
    };
    try {
      const { serviceKey } = request.body;
      const transaction = await createService(
        serviceKey
      ).saveTransaction(request.body);
      return {
        headers,
        statusCode: 200,
        body: {
          transaction,
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

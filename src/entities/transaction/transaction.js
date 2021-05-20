module.exports = function buildCreateTransaction({
  dateTimeValidator,
}) {
  return function createTransaction({
    machineId,
    serviceKey,
    cardId,
    paymentType,
    amount,
    transactionCount,
    date,
    time,
    send,
  }) {
    if (!machineId) {
      throw new Error('Transaction must have a machine id.');
    }
    if (!serviceKey) {
      throw new Error('Transaction must have a service key.');
    }
    if (!cardId) {
      throw new Error('Transaction must have a card id.');
    }
    if (!paymentType) {
      throw new Error('Transaction must have a payment type.');
    }
    if (!amount) {
      throw new Error('Transaction must have an amount.');
    }
    if (!transactionCount) {
      throw new Error('Transaction must have a transaction count.');
    }
    if (typeof send !== 'boolean') {
      throw new Error('Transaction must have a send status.');
    }
    if (!dateTimeValidator(date, 'DD.MM.YYYY')) {
      throw new Error('Date format is not DD.MM.YYYY.');
    }
    if (!dateTimeValidator(time, 'HH:mm')) {
      throw new Error('Time format is not HH:mm.');
    }

    return Object.freeze({
      getKeys: () => {
        return { machineId, serviceKey, date, time };
      },
      getData: () => {
        return {
          cardId,
          amount,
          paymentType,
          transactionCount,
          send,
        };
      },
    });
  };
};

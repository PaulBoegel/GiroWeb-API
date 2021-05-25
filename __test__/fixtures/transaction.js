function createFakeTransaction(overrides) {
  const transaction = {
    machineId: 100,
    serviceKey: 'test',
    cardId: 1,
    paymentType: 'cash',
    amount: 500,
    transactionCounter: 1,
    date: '18.05.2021',
    time: '10:43:55',
    send: false,
  };

  return {
    ...transaction,
    ...overrides,
  };
}

module.exports = createFakeTransaction;

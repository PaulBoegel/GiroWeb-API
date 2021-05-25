function createFakeCashQuantity(overrides) {
  const cashQuantity = {
    machineId: 100,
    serviceKey: 'test',
    date: '18.05.2021',
    time: '10:43:55',
    paymentType: 'cash',
    type: 'bill assumption',
    total: 500,
    send: false,
    detail: [
      {
        value: 500,
        quantity: 0,
        total: 0,
      },
      {
        value: 1000,
        quantity: 0,
        total: 0,
      },
      {
        value: 2000,
        quantity: 0,
        total: 0,
      },
      {
        value: 5000,
        quantity: 0,
        total: 0,
      },
    ],
  };

  return {
    ...cashQuantity,
    ...overrides,
  };
}

module.exports = createFakeCashQuantity;

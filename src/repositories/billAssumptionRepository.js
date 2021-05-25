const { createCashQuantity } = require('../entities/cash-quantity');

function BillAssumptionRepository({ makeDb }) {
  async function create(keys, data) {
    const db = await makeDb();
    const values = [500, 1000, 2000, 5000];
    const { ops } = await db.collection('billAssumption').insertOne({
      ...keys,
      date: data.date,
      time: data.time,
      total: data.amount,
      type: 'bill assumption',
      paymentType: 'cash',
      detail: values.map((value) => {
        return {
          value,
          quantity: data.amount === value ? 1 : 0,
          total: data.amount === value ? data.amount : 0,
        };
      }),
    });
    const { _id, ...result } = ops[0];
    return result;
  }

  async function update({
    serviceKey,
    machineId,
    date,
    time,
    amount,
  }) {
    const db = await makeDb();
    const result = await db
      .collection('billAssumption')
      .findOneAndUpdate(
        {
          serviceKey,
          machineId,
          'detail.value': amount,
        },
        {
          $set: {
            date,
            time,
          },
          $inc: {
            total: amount,
            'detail.$.quantity': 1,
            'detail.$.total': amount,
          },
        },
        { returnOriginal: false }
      );
    return result;
  }

  async function isExisting(keys) {
    const db = await makeDb();
    const result = await db
      .collection('billAssumption')
      .find(keys)
      .count();
    return Boolean(result);
  }

  async function increase(transaction) {
    const { serviceKey, machineId, date, time } =
      transaction.getKeys();
    const { amount } = transaction.getData();
    if ((await isExisting(transaction.getKeys())) === false) {
      const result = await create(
        { serviceKey, machineId },
        { date, time, amount }
      );
      return createCashQuantity(result);
    }

    const result = await update({
      serviceKey,
      machineId,
      date,
      time,
      amount,
    });

    return createCashQuantity(result.value);
  }

  async function get(query, projection) {
    if (!query || Object.entries(query).length === 0) {
      throw new Error('Query cannot be empty.');
    }
    const db = await makeDb();
    const result = await db
      .collection('billAssumption')
      .findOne(query, projection);
    if (!result) return undefined;
    return createCashQuantity(result);
  }

  return { increase, get };
}

module.exports = BillAssumptionRepository;

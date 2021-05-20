const { createCashQuantity } = require('../entities/cash-quantity');

function BillAssumptionRepository({ makeDb }) {
  async function create(keys, amount) {
    const db = await makeDb();
    const values = [500, 1000, 2000, 5000];
    const { ops } = await db.collection('billAssumption').insertOne({
      ...keys,
      total: 0,
      type: 'bill assumption',
      paymentType: 'cash',
      detail: values.map((value) => {
        return {
          value,
          quantity: amount === value ? 1 : 0,
          total: amount === value ? amount : 0,
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
    const result = await db.collection('billAssumption').updateOne(
      {
        serviceKey,
        machineId,
        date,
        time,
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
      }
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
    const { amount } = transaction.getData();
    if ((await isExisting(transaction.getKeys())) === false) {
      const result = await create(transaction.getKeys(), amount);
      return createCashQuantity(result);
    }

    const result = await update({
      ...transaction.getKeys(),
      amount,
    });

    return createCashQuantity(result);
  }

  async function get(query, projection) {
    if (!query || Object.entries(query).length === 0) {
      throw new Error('Query cannot be empty.');
    }
    const db = await makeDb();
    const { _id, ...result } = await db
      .collection('billAssumption')
      .findOne(query, projection);
    return createCashQuantity(result);
  }

  return { increase, get };
}

module.exports = BillAssumptionRepository;

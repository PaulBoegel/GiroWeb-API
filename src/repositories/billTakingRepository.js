const { createCashQuantity } = require('../entities/cash-quantity');

function BillTakingRepository({ makeDb }) {
  async function add(billTakingData) {
    const db = await makeDb();
    const billTaking = createCashQuantity(billTakingData);
    const keys = billTaking.getKeys();
    const data = billTaking.getData();
    const { ops } = await db.collection('billTaking').insertOne({
      ...keys,
      ...data,
    });
    const { _id: id, ...result } = ops[0];
    return createCashQuantity(result);
  }

  async function updateQuantities({
    serviceKey,
    machineId,
    cashQuantities,
  }) {
    const db = await makeDb();
    const updatePromises = cashQuantities.map((quantity) => {
      const keys = {
        serviceKey,
        machineId,
        cashQuantities: {
          $elemMatch: { date: quantity.date, time: quantity.time },
        },
      };
      return db
        .collection('billTaking')
        .updateOne(keys, { $set: { 'cashQuantities.$.send': true } });
    });
    await Promise.all(updatePromises);
  }

  async function get(query, projection) {
    if (!query || Object.entries(query).length === 0) {
      throw new Error('Query is empty.');
    }
    const db = await makeDb();
    const [result] = await db
      .collection('billTaking')
      .find(query)
      .project(projection)
      .toArray();
    return createCashQuantity(result);
  }
  return { add, updateQuantities, get };
}

module.exports = BillTakingRepository;

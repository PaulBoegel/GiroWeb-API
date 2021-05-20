function BillTakingRepository({ makeDb }) {
  async function add({ serviceKey, machineId, cashQuantities }) {
    const db = await makeDb();
    const key = {
      serviceKey,
      machineId,
    };

    await db.collection('billTaking').updateOne(
      key,
      {
        $addToSet: {
          cashQuantities: { $each: cashQuantities },
        },
      },
      { upsert: true }
    );
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
    const db = await makeDb();
    const result = await db
      .collection('billTaking')
      .find(query)
      .project(projection);
    return result.toArray();
  }
  return { add, updateQuantities, get };
}

module.exports = BillTakingRepository;

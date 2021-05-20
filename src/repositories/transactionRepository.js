function TransactionRepository({ makeDb }) {
  async function get(query, projection, limit) {
    const db = await makeDb();
    let transactions = db
      .collection('transactions')
      .find(query, { fields: projection });

    if (limit > 0) {
      transactions = transactions.limit(limit);
    }

    transactions = await transactions.toArray();

    return transactions;
  }

  async function add(transaction) {
    const db = await makeDb();
    const keys = transaction.getKeys();
    const data = transaction.getData();
    const { ops } = await db
      .collection('transactions')
      .insertOne({ ...keys, ...data });
    const { _id: id, ...result } = ops[0];
    return result;
  }

  async function update(transaction, updateData) {
    const db = await makeDb();
    const { serviceKey, machineId, date, time } = transaction;
    const keys = {
      serviceKey,
      machineId,
      date,
      time,
    };

    await db
      .collection('transactions')
      .updateOne(keys, { $set: updateData });
  }
  return { get, add, update };
}

module.exports = TransactionRepository;

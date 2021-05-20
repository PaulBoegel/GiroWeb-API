const createTransaction = require('../entities/transaction');

function TransactionRepository({ makeDb }) {
  async function get(query, projection, limit) {
    const db = await makeDb();
    let transactions = db
      .collection('transactions')
      .find(query, { fields: projection });

    if (limit > 0) {
      transactions = transactions.limit(limit);
    }

    [transactions] = await transactions.toArray();

    return createTransaction(transactions);
  }

  async function add(transactionData) {
    const db = await makeDb();
    const transaction = createTransaction(transactionData);
    const { ops } = await db.collection('transactions').insertOne({
      ...transaction.getKeys(),
      ...transaction.getData(),
    });
    const { _id: id, ...result } = ops[0];
    return createTransaction(result);
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

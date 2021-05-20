const createTransaction = require('../entities/transaction');

function TransactionRepository({ makeDb }) {
  async function get(query, projection) {
    if (!query || Object.entries(query).length === 0) {
      throw new Error('Query is empty.');
    }
    const db = await makeDb();
    const transactionsArray = await db
      .collection('transactions')
      .find(query)
      .project(projection)
      .toArray();

    return transactionsArray.map((transaction) =>
      createTransaction(transaction)
    );
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

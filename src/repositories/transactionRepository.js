const RepositoryBase = require('./repositoryBase');

function TransactionRepository() {
  async function get(query, projection, limit) {
    let transactions = this.db
      .collection('transactions')
      .find(query, { fields: projection });

    if (limit > 0) {
      transactions = transactions.limit(limit);
    }

    transactions = await transactions.toArray();

    return transactions;
  }

  async function add(newTransaction) {
    const { serviceKey, machineId, date, time, ...data } = newTransaction;
    const keys = {
      serviceKey,
      machineId,
      date,
      time,
    };
    await this.db
      .collection('transactions')
      .updateOne(keys, { $set: { ...data } }, { upsert: true });
  }

  async function update(transaction, updateData) {
    const { serviceKey, machineId, date, time } = transaction;
    const keys = {
      serviceKey,
      machineId,
      date,
      time,
    };

    await this.db
      .collection('transactions')
      .updateOne(keys, { $set: updateData });
  }
  return Object.setPrototypeOf(
    Object.assign(RepositoryBase(), { get, add, update }),
    RepositoryBase
  );
}

module.exports = TransactionRepository;

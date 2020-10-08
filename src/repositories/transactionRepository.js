const { MongoClient } = require('mongodb');

function TransactionRepository(dbConfig) {
  const { dbName, host, port } = dbConfig;
  const url = `mongodb://${host}:${port}`;
  let db;

  function connect() {
    return new Promise((resolve, reject) => {
      MongoClient.connect(
        url,
        {
          useUnifiedTopology: true,
          poolSize: dbConfig.poolSize,
        },
        (err, client) => {
          if (err) throw reject(err);
          db = client.db(dbName);
          resolve(true);
        }
      );
    });
  }

  async function get(query, projection, limit) {
    let transactions = db
      .collection('transactions')
      .find(query, { fields: projection });

    if (limit > 0) {
      transactions = transactions.limit(limit);
    }

    transactions = await transactions.toArray();

    return transactions;
  }

  async function add(newTransaction) {
    const { serviceKey, machineID, date, time, ...data } = newTransaction;
    const keys = {
      serviceKey,
      machineID,
      date,
      time,
    };
    await db
      .collection('transactions')
      .updateOne(keys, { $set: { ...data } }, { upsert: true });
  }

  async function update(transaction, updateData) {
    const { serviceKey, machineID, date, time } = transaction;
    const keys = {
      serviceKey,
      machineID,
      date,
      time,
    };

    await db.collection('transactions').updateOne(keys, { $set: updateData });
  }

  return { connect, get, add, update };
}

module.exports = TransactionRepository;

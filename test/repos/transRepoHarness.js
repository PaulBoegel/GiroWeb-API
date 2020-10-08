const assert = require('assert');
const { MongoClient } = require('mongodb');
const dbConfig = require('../../config/dbconfig.json');
const TransactionRepository = require('../../src/repositories/transactionRepository');
const transaction = require('../mocks/transactionMock.json');

async function main() {
  const { host, port, dbName } = dbConfig.test;
  const url = `mongodb://${host}:${port}`;
  const client = new MongoClient(url);
  const transRepo = new TransactionRepository(dbConfig.test);

  try {
    await transRepo.connect();

    // add transaction
    transaction.timestamp = Date.now();
    await transRepo.add(transaction);

    // get transaction
    const query = {
      machineID: transaction.machineID,
      serviceKey: transaction.serviceKey,
      transactionCounter: transaction.transactionCounter,
    };

    const filterData = await transRepo.get(query);
    assert.strictEqual(filterData[0].transactionCounter, 15);

    // update transaction
    const updateData = { send: true };
    await transRepo.update(transaction, updateData);
    const updatedTransaction = await transRepo.get(query);
    assert.strictEqual(updatedTransaction[0].send, true);
  } catch (err) {
    console.log(err);
  } finally {
    await client.connect();
    client.db(dbName);

    const admin = client.db(dbName).admin();

    await client.db(dbName).dropDatabase();
    console.log('\n - TransactionRepo - Success');
    client.close();
  }
}

main();

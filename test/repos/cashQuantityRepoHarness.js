const assert = require('assert');
const { MongoClient } = require('mongodb');
const dbConfig = require('../../config/dbconfig.json');
const CashQuantityRepository = require('../../src/repositories/cashQuantityRepository');
const cashQuantity = require('../mocks/cashQuantityMock.json');

async function main() {
  const { host, port, dbName } = dbConfig.test;
  const url = `mongodb://${host}:${port}`;
  const client = new MongoClient(url);
  const cashQuantitiyRepo = new CashQuantityRepository(dbConfig.test);

  try {
    await cashQuantitiyRepo.connect();

    // add cashQuantity
    await cashQuantitiyRepo.add(cashQuantity);

    // get cashQuantity
    const query = {
      machineID: cashQuantity.machineID,
      serviceKey: cashQuantity.serviceKey,
    };
    const filterData = await cashQuantitiyRepo.get(query);
    assert.strictEqual(filterData[0].cashQuantities.length, 1);

    // add another quantity
    cashQuantity.cashQuantities.date = '24.09.2020';
    await cashQuantitiyRepo.add(cashQuantity);
    const secondData = await cashQuantitiyRepo.get(query);
    assert.strictEqual(secondData[0].cashQuantities.length, 2);

    // reject duplicated quantities with existing date and time but different total
    // cashQuantity.cashQuantities.total = 5000;
    await cashQuantitiyRepo.add(cashQuantity);
    const duplicatedData = await cashQuantitiyRepo.get(query);
    assert.strictEqual(duplicatedData[0].cashQuantities.length, 2);
  } catch (err) {
    console.log(err);
  } finally {
    await client.connect();
    client.db(dbName);

    const admin = client.db(dbName).admin();

    await client.db(dbName).dropDatabase();
    console.log('\n - CashQuantityRepo - Success');
    client.close();
  }
}

main();

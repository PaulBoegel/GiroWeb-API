const assert = require('assert');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const BillStockRepository = require('../../src/repositories/billStockRepository');
const billStock = require('../mocks/billStockMock.json');

const getDbConf = () => {
    return {
        host: "localhost",
        port: "",
        dbName: "billStockRepositoryTest",
        poolSize: "100"
    }
}

describe("BillStockRepository add", () => {
    let repo
    let client;
    before(async () => {
        const { host, port, dbName } = getDbConf();
        const url = `mongodb://${host}:${port}`;
        client = new MongoClient(url);
        repo = BillStockRepository(getDbConf());
        await repo.connect();
    })
    it("should return 1 if add is successfull", async () => {
        const result = await repo.add(billStock);
        assert.strictEqual(result, 1);
    })
    after(async () => {
        await client.connect();
        client.db(getDbConf().dbName);

        const admin = client.db(getDbConf().dbName).admin();

        await client.db(getDbConf().dbName).dropDatabase();
        client.close();

    })
})

describe("BillStockRepository create", () => {
    let repo
    let client;
    before(async () => {
        const { host, port, dbName } = getDbConf();
        const url = `mongodb://${host}:${port}`;
        client = new MongoClient(url);
        repo = BillStockRepository(getDbConf());
        await repo.connect();
    })
    it("should return 1 if create was successfull", async () => {
        const result = await repo.add(billStock);
        assert.strictEqual(result, 1);
    })
    after(async () => {
        await client.connect();
        client.db(getDbConf().dbName);
        const admin = client.db(getDbConf().dbName).admin();
        await client.db(getDbConf().dbName).dropDatabase();
        client.close();

    });
});

describe("BillStockRepository get", () => {
    let repo
    let client;
    before(async () => {
        const { host, port, dbName } = getDbConf();
        const url = `mongodb://${host}:${port}`;
        client = new MongoClient(url);
        repo = BillStockRepository(getDbConf());
        await repo.connect();
        await repo.add(billStock);
    })
    it("should return total value of all stocks", async () => {
        const { serviceKey, machineId } = billStock;
        const result = await repo.get({serviceKey, machineId}, {_id: 0, detail: 1, total: 1});
        assert.strictEqual(result.total, billStock.total);
    })
    it("should return all stock entrys", async () => {
        const { serviceKey, machineId } = billStock;
        const result = await repo.get({serviceKey, machineId}, {_id: 0, detail: 1, total: 1});
        assert.strictEqual(result[0].detail.length, 4);
    })
    after(async () => {
        await client.connect();
        client.db(getDbConf().dbName);

        const admin = client.db(getDbConf().dbName).admin();

        await client.db(getDbConf().dbName).dropDatabase();
        client.close();

    });
});
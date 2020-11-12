const assert = require('assert');
const sinon = require('sinon');
const http = require('http');
const TestService = require('../src/services/testService');
const TransactionRepository = require('../src/repositories/transactionRepository')
const CashQuantityRepository = require('../src/repositories/cashQuantityRepository');
const quantityMock = require('./mocks/cashQuantityMock.json');
const transactionMock = require('./mocks/transactionMock.json');
const responseFactory = require('./mocks/responseFactory');
const requestFactory = require('./mocks/requestFactory');

describe('TestService sendCashQuantities', () => {
  let service; 
  let transRepo;
  let cashQuantityRepo;
  let res;
  let req;
  beforeEach(() => {
    transRepo = TransactionRepository({});
    sinon.stub(transRepo, "connect");
    sinon.stub(transRepo, "add");
    sinon.stub(transRepo, "update");
    cashQuantityRepo = CashQuantityRepository({});
    sinon.stub(cashQuantityRepo, "connect");
    sinon.stub(cashQuantityRepo, "add");
    service = TestService({transRepo, cashQuantityRepo});
    res = responseFactory();
    req = requestFactory();
  })
  it('should return a message if request was send succesful', async () => {
    sinon.stub(transRepo, "get").returns([]);
    sinon.stub(http, "request").yields(res).returns(req);
    const result = await service.SendCashQuantities(quantityMock);
    assert.strictEqual(result, "request successful");
  });
  afterEach(() => {
    transRepo.connect.restore();
    transRepo.add.restore();
    transRepo.get.restore();
    transRepo.update.restore();
    cashQuantityRepo.connect.restore();
    cashQuantityRepo.add.restore();
    http.request.restore();
  })
});

describe("TestService ExtractBillStok", () => {
  let service;
  beforeEach(() => {
    service = TestService({});
  })
  it("should return an array", () => {
    const billStok = service.ExtractBillStock([transactionMock]);
    assert.strictEqual(Array.isArray(billStok), true);
  });
  it("should return a stock entry for 500, 1000, 2000 and 5000", () => {
    const billStok = service.ExtractBillStock([transactionMock]);
    const five = billStok.find((stock) => stock.value === 500);
    assert.strictEqual(typeof five === "object", true);
    const ten = billStok.find((stock) => stock.value === 1000);
    assert.strictEqual(typeof ten === "object", true);
    const twenty = billStok.find((stock) => stock.value === 2000);
    assert.strictEqual(typeof twenty === "object", true);
    const fifty = billStok.find((stock) => stock.value === 5000);
    assert.strictEqual(typeof fifty === "object", true);
  })
  it("should extract the transaction values and increment the stock entrys", () => {
    const transactionCount = Math.floor((Math.random() * 10) + 1);
    const transactions = [];
    for(let index = 0; index < transactionCount; index+=1){
      transactions.push(transactionMock);
    }
    const billStock = service.ExtractBillStock(transactions);
    const five = billStock.find(stock => stock.value === 500);
    assert.strictEqual(five.quantity, transactions.length);
    assert.strictEqual(five.total, transactions.length * 500);
  })
})

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

describe("TestService SaveBillStock", () => {
  let service;
  beforeEach(() => {
    service = TestService({});
  })
  
})

describe("TestService PrepareBillStock", () => {
  let service;
  let date;
  let time;
  let billStockDetails;
  beforeEach(() => {
    date = quantityMock.cashQuantities[0].date;
    time = quantityMock.cashQuantities[0].time;
    service = TestService({});
    billStockDetails = quantityMock.cashQuantities[0].detail;
  })
  it("should return bill stock details", () => {
    const billStock = service.PrepareBillStock({date, time, billStockDetails});
    assert.strictEqual(billStock.detail, billStockDetails);
  })
  it("should return bill stock total", () => {
    const billStock = service.PrepareBillStock({date, time, billStockDetails});
    assert.strictEqual(billStock.total, 4500);
  })
});

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const {
  makeDb,
  closeDb,
  clearDb,
} = require('../../__test__/fixtures/db');
const serviceFactory = require('./serviceFactory');
const helloTessService = require('./helloTessService');
const TransactionRepository = require('../repositories/transactionRepository');
const BillAssumptionRepository = require('../repositories/billAssumptionRepository');
const BillTakingRepository = require('../repositories/billTakingRepository');
const BillStockRepository = require('../repositories/billStockRepository');
const makeFakeTransaction = require('../../__test__/fixtures/transaction');
const makeFakeCashQuantity = require('../../__test__/fixtures/cashQuantity');
const { createCashQuantity } = require('../entities/cash-quantity');
const createTransaction = require('../entities/transaction');
const createFakeCashQuantity = require('../../__test__/fixtures/cashQuantity');

const { expect } = chai;
chai.use(chaiAsPromised);

describe('helloTessService', () => {
  let options;
  let createService;
  beforeEach(() => {
    options = {
      network: {},
      services: { helloTess: helloTessService },
      transRepo: TransactionRepository({ makeDb }),
      billStockRepo: BillStockRepository({ makeDb }),
      billAssumptionRepo: BillAssumptionRepository({ makeDb }),
      billTakingRepo: BillTakingRepository({ makeDb }),
    };
    createService = serviceFactory(options);
  });

  describe('SaveTransaction', () => {
    it('should return a transaction object', async () => {
      const transactionData = makeFakeTransaction({});
      const service = createService('helloTess');
      const transaction = createTransaction(transactionData);
      const saved = await service.SaveTransaction(transactionData);
      expect(saved.getKeys()).eql(transaction.getKeys());
      expect(saved.getData()).eql(transaction.getData());
    });

    it('should send transaction data to the persinstence layer', async () => {
      const repo = TransactionRepository({ makeDb });
      const transactionData = makeFakeTransaction({});
      const service = createService('helloTess');
      const transaction = createTransaction(transactionData);
      await service.SaveTransaction(transactionData);
      const [saved] = await repo.get(transaction.getKeys());
      expect(saved.getKeys()).eql(transaction.getKeys());
      expect(saved.getData()).eql(transaction.getData());
    });
    afterEach(async () => {
      await clearDb();
    });
  });

  describe('IncreaseBillAssumption', () => {
    it('should increase the bill assumptions with transaction data if the payment type is cash', async () => {
      const transactionData = makeFakeTransaction({});
      const transaction = createTransaction(transactionData);
      const service = createService('helloTess');
      const updated = await service.IncreaseBillAssumption(
        transactionData
      );
      expect(transaction.getKeys()).eql(updated.getKeys());
      expect(updated.getDetailEntry(0).quantity).eq(1);
    });

    it('should not increase the bill assumptions if transaction payment type is not cash', async () => {
      const cashTransaction = makeFakeTransaction({});
      const giroTransaction = makeFakeTransaction({
        paymentType: 'giro',
      });
      const service = createService('helloTess');
      await service.IncreaseBillAssumption(cashTransaction);
      const updatedGiro = await service.IncreaseBillAssumption(
        giroTransaction
      );

      const { machineId, serviceKey } = updatedGiro.getKeys();
      const firstDetailEntry = updatedGiro.getDetailEntry(0);

      expect(machineId).eq(giroTransaction.machineId);
      expect(serviceKey).eq(giroTransaction.serviceKey);
      expect(firstDetailEntry.quantity).eq(1);
    });

    it('should update the assumption data with every new transaction', async () => {
      const transaction = makeFakeTransaction({});
      const service = createService('helloTess');
      await service.IncreaseBillAssumption(transaction);
      const result = await service.IncreaseBillAssumption(
        transaction
      );
      const firstEntry = result.getDetailEntry(0);
      expect(firstEntry.total).eq(1000);
      expect(firstEntry.quantity).eq(2);
    });

    it('should throw an error if no transaction data passed.', async () => {
      const service = createService('helloTess');
      await expect(
        service.IncreaseBillAssumption()
      ).to.be.rejectedWith('No transaction data passed.');
    });

    afterEach(async () => {
      await clearDb();
    });
  });

  describe('SaveBillTaken', () => {
    it('should return a cash quantity object', async () => {
      const service = createService('helloTess');
      const billTakingData = makeFakeCashQuantity({
        type: 'bill taking',
      });
      const billTaking = createCashQuantity(billTakingData);
      const saved = await service.SaveBillTaking(billTakingData);
      expect(saved.getKeys()).eql(billTaking.getKeys());
      expect(saved.getData()).eql(billTaking.getData());
    });

    it('should send the cash quantity data to the persistence layer', async () => {
      const repo = BillTakingRepository({ makeDb });
      const service = createService('helloTess');
      const billTakingData = makeFakeCashQuantity({
        type: 'bill taking',
      });
      const billTaking = createCashQuantity(billTakingData);
      await service.SaveBillTaking(billTakingData);
      const saved = await repo.get(billTaking.getKeys());
      expect(saved.getKeys()).eql(billTaking.getKeys());
      expect(saved.getData()).eql(billTaking.getData());
    });

    afterEach(async () => {
      await clearDb();
    });
  });

  describe('SaveBillStock', () => {
    it('should return a cash quantity object', async () => {
      const service = createService('helloTess');
      const billStockData = createFakeCashQuantity({
        type: 'bill stock',
      });
      const billStock = createCashQuantity(billStockData);
      const saved = await service.SaveBillStock(billStockData);
      expect(saved.getKeys()).eql(billStock.getKeys());
      expect(saved.getData()).eql(billStock.getData());
    });
    it('should send the cash quantity data to the persistence layer', async () => {
      const repo = BillStockRepository({ makeDb });
      const service = createService('helloTess');
      const billStockData = makeFakeCashQuantity({
        type: 'bill stock',
      });
      const billStock = createCashQuantity(billStockData);
      await service.SaveBillStock(billStockData);
      const [saved] = await repo.get(billStock.getKeys());
      expect(saved.getKeys()).eql(billStock.getKeys());
      expect(saved.getData()).eql(billStock.getData());
    });
    afterEach(async () => {
      await clearDb();
    });
  });

  describe('GetBillingData', () => {
    it('should return an object with transaction entities', async () => {
      const transactionData = makeFakeTransaction({
        serviceKey: 'HelloTess',
        machineId: 100,
      });
      const billStockData = makeFakeCashQuantity({
        serviceKey: 'HelloTess',
        machineId: 100,
        type: 'bill stock',
      });
      const transRepo = TransactionRepository({ makeDb });
      const billStockRepo = BillStockRepository({ makeDb });
      const billAssumptionRepo = BillAssumptionRepository({ makeDb });

      const transaction = await transRepo.add(transactionData);
      await billAssumptionRepo.increase(transaction);
      await billStockRepo.add(billStockData);

      const service = createService('helloTess');
      const billingData = await service.GetBillingData(100);

      billingData.transactions.forEach((entity) => {
        expect(entity.getKeys).to.be.a('function');
        expect(entity.getData).to.be.a('function');
      });
      billingData.cashQuantities.forEach((entity) => {
        expect(entity.getKeys).to.be.a('function');
        expect(entity.getData).to.be.a('function');
        expect(entity.getDetailEntry).to.be.a('function');
      });
    });

    it('should throw an error if no stack data is available', async () => {
      const transactionData = makeFakeTransaction({
        serviceKey: 'HelloTess',
        machineId: 100,
      });

      const transRepo = TransactionRepository({ makeDb });
      await transRepo.add(transactionData);

      const service = createService('helloTess');
      await expect(service.GetBillingData(100)).to.be.rejectedWith(
        'No bill stock data available.'
      );
    });

    it('should return billing data without bill assumption, if no assumption was created', async () => {
      const transactionData = makeFakeTransaction({
        serviceKey: 'HelloTess',
        machineId: 100,
      });

      const billStockData = makeFakeCashQuantity({
        serviceKey: 'HelloTess',
        machineId: 100,
        type: 'bill stock',
      });

      const transRepo = TransactionRepository({ makeDb });
      const billStockRepo = BillStockRepository({ makeDb });

      await transRepo.add(transactionData);
      await billStockRepo.add(billStockData);

      const service = createService('helloTess');
      const billingData = await service.GetBillingData(100);

      expect(billingData.cashQuantities.length).eq(1);
    });
    afterEach(async () => {
      await clearDb();
    });
  });

  after(async () => {
    await closeDb();
  });
});

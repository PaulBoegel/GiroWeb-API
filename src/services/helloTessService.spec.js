const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const {
  makeDb,
  closeDb,
  clearDb,
} = require('../../__test__/fixtures/db');
const TransactionRepository = require('../repositories/transactionRepository');
const BillAssumptionRepository = require('../repositories/billAssumptionRepository');
const BillTakingRepository = require('../repositories/billTakingRepository');
const makeFakeTransaction = require('../../__test__/fixtures/transaction');
const makeFakeCashQuantity = require('../../__test__/fixtures/cashQuantity');
const { createCashQuantity } = require('../entities/cash-quantity');
const HelloTess = require('./helloTessService');
const createTransaction = require('../entities/transaction');

const { expect } = chai;
chai.use(chaiAsPromised);

describe('helloTessService', () => {
  let options;
  beforeEach(() => {
    options = {
      transRepo: TransactionRepository({ makeDb }),
      billStockRepo: {},
      billAssumptionRepo: BillAssumptionRepository({ makeDb }),
      billTakingRepo: BillTakingRepository({ makeDb }),
    };
  });

  describe('SaveTransaction', () => {
    it('should return a transaction object', async () => {
      const transactionData = makeFakeTransaction({});
      const service = HelloTess(options);
      const transaction = createTransaction(transactionData);
      const saved = await service.SaveTransaction(transactionData);
      expect(saved.getKeys()).eql(transaction.getKeys());
      expect(saved.getData()).eql(transaction.getData());
    });

    it('should send transaction data to the persinstence layer', async () => {
      const repo = TransactionRepository({ makeDb });
      const transactionData = makeFakeTransaction({});
      const service = HelloTess(options);
      const transaction = createTransaction(transactionData);
      await service.SaveTransaction(transactionData);
      const saved = await repo.get(transaction.getKeys());
      expect(saved.getKeys()).eql(transaction.getKeys());
      expect(saved.getData()).eql(transaction.getData());
    });
    afterEach(async () => {
      await clearDb();
    });
  });

  describe('UpdateBillAssumption', () => {
    it('should increase the bill assumptions with transaction data if the payment type is cash', async () => {
      const transactionData = makeFakeTransaction({});
      const transaction = createTransaction(transactionData);
      const service = HelloTess(options);
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
      const service = HelloTess(options);
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

    it('should throw an error if no transaction data passed.', async () => {
      const service = HelloTess(options);
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
      const service = HelloTess(options);
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
      const service = HelloTess(options);
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

  after(async () => {
    await closeDb();
  });
});

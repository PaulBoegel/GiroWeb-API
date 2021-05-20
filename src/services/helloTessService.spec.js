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
const HelloTess = require('./helloTessService');

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
    it('should add a transaction entity to the database', async () => {
      const transactionData = makeFakeTransaction({});
      const service = HelloTess(options);
      const saved = await service.SaveTransaction(transactionData);
      expect(saved).eql(transactionData);
    });

    afterEach(async () => {
      await clearDb();
    });
  });

  describe('UpdateBillAssumption', () => {
    it('should increase the bill assumptions with transaction data if the payment type is cash', async () => {
      const transactionData = makeFakeTransaction({});
      const service = HelloTess(options);
      const updated = await service.IncreaseBillAssumption(
        transactionData
      );
      expect(updated.machineId).eq(transactionData.machineId);
      expect(updated.serviceKey).eq(transactionData.serviceKey);
      expect(updated.detail[0].quantity).eq(1);
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
    it('should add a cashQuantity with type bill taking to the database', () => {
      const billTaken = makeFakeCashQuantity({ type: 'bill taken' });
    });
  });

  after(async () => {
    await closeDb();
  });
});

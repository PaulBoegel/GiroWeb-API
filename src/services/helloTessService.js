const createTransaction = require('../entities/transaction');

const SERVICE_KEY = 'HelloTess';

async function IncreaseBillAssumption(transactionData) {
  if (!transactionData) {
    throw Error('No transaction data passed.');
  }
  const transaction = createTransaction(transactionData);
  const { paymentType } = transaction.getData();
  if (paymentType !== 'cash') {
    const billAssumption = await this.billAssumptionRepo.get(
      transaction.getKeys()
    );
    return billAssumption;
  }
  const billAssumption = await this.billAssumptionRepo.increase(
    transaction
  );
  return billAssumption;
}

async function SaveBillTaking(billTakingData) {
  const billTaking = await this.billTakingRepo.add(billTakingData);
  return billTaking;
}

async function SaveTransaction(transactionData) {
  const saved = await this.transRepo.add({
    ...transactionData,
    send: false,
  });
  return saved;
}

async function SaveBillStock(billStockData) {
  const saved = await this.billStockRepo.add({
    ...billStockData,
    send: false,
  });
  return saved;
}

function prepareCashQuantitieJsonObj(
  machineId,
  date,
  time,
  transactions,
  cashQuantities
) {
  const headerTmp = {
    type: 'data',
    name: 'audit',
    version: '1.0',
    machineId,
    date: time,
    time: date,
  };

  return JSON.stringify({
    header: headerTmp,
    body: {
      transactions,
      cashQuantities,
    },
  });
}

function prepareCashQuantitieOptions() {
  return {
    hostname: process.env.HELLO_TESS_URL,
    path: process.env.HELLO_TESS_PATH,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };
}

async function GetOpenTransactionValues(keys) {
  const openTransactions = await this.transRepo.get({
    ...keys,
    send: false,
  });
  if (!openTransactions) return undefined;
  return openTransactions.map((transaction) => {
    const { machineId, serviceKey, ...transactionKeys } =
      transaction.getKeys();
    return { ...transactionKeys, ...transaction.getData() };
  });
}

async function GetOpenBillStockValues(keys) {
  const openBillStocks = await this.billStockRepo.get({
    ...keys,
    send: false,
  });
  if (!openBillStocks) return undefined;
  return openBillStocks.map((billStock) => {
    const { machineId, serviceKey, ...billStockKeys } =
      billStock.getKeys();
    return { ...billStockKeys, ...billStock.getData() };
  });
}

async function GetBillAssumptionValues(keys) {
  const billAssumption = await this.billAssumptionRepo.get(keys);
  if (!billAssumption) return undefined;
  const { machineId, serviceKey, ...billAssumptionKeys } =
    billAssumption.getKeys();
  return {
    ...billAssumptionKeys,
    ...billAssumption.getData(),
  };
}

async function GetBillingData(machineId) {
  const keys = { machineId, serviceKey: SERVICE_KEY };
  const transactions = await GetOpenTransactionValues.call(
    this,
    keys
  );
  const billStock = await GetOpenBillStockValues.call(this, keys);
  const billAssumption = await GetBillAssumptionValues.call(
    this,
    keys
  );

  return {
    transactions,
    cashQuantities: [...billStock, billAssumption],
  };
}

async function GetBillTakingData(machineId) {
  const keys = { machineId, serviceKey: SERVICE_KEY };
  const billTakings = await this.billTakingRepo.get(keys);
  if (!billTakings) return undefined;
  return {
    ...billTakings.getKeys(),
    ...billTakings.getData(),
  };
}

module.exports = {
  GetBillingData,
  GetBillTakingData,
  SaveTransaction,
  SaveBillStock,
  SaveBillTaking,
  IncreaseBillAssumption,
};

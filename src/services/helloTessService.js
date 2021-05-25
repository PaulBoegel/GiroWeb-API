const createTransaction = require('../entities/transaction');

const SERVICE_KEY = 'HelloTess';

async function IncreaseBillAssumption(transactionData) {
  if (!transactionData) {
    throw Error('No transaction data passed.');
  }
  const transaction = createTransaction(transactionData);
  const { machineId, serviceKey } = transaction.getKeys();
  const { paymentType } = transaction.getData();
  if (paymentType !== 'cash') {
    const billAssumption = await this.billAssumptionRepo.get({
      machineId,
      serviceKey,
    });
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

async function GetOpenTransactions(keys) {
  const openTransactions = await this.transRepo.get({
    ...keys,
    send: false,
  });
  if (!openTransactions) return undefined;
  return openTransactions;
}

async function GetOpenBillStocks(keys) {
  const openBillStocks = await this.billStockRepo.get({
    ...keys,
    send: false,
  });
  if (!openBillStocks) return undefined;
  return openBillStocks;
}

function FilterEntityData(entity) {
  const { serviceKey, machineId, ...keys } = entity.getKeys();
  const { send, ...data } = entity.getData();
  return { ...keys, ...data };
}

async function GetBillingData(machineId) {
  const keys = { machineId, serviceKey: SERVICE_KEY };
  const billStock = await GetOpenBillStocks.call(this, keys);

  if (billStock.length === 0)
    throw new Error('No bill stock data available.');

  const transactions = await GetOpenTransactions.call(this, keys);

  const billingData = {
    transactions,
    cashQuantities: billStock,
  };

  const billAssumption = await this.billAssumptionRepo.get(keys);

  if (billAssumption) billingData.cashQuantities.push(billAssumption);

  return billingData;
}

async function GetBillTakingData(machineId) {
  const queryData = { machineId, serviceKey: SERVICE_KEY };
  const billTaking = await this.billTakingRepo.get(queryData);

  if (!billTaking) return undefined;

  const billTakingData = FilterEntityData(billTaking);
  return {
    cashQuantities: [
      {
        ...billTakingData,
      },
    ],
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

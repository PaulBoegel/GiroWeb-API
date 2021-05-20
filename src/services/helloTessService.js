const { SendHttp, SendHttps } = require('../helper/networkHelper');
const createTransaction = require('../entities/transaction');
const {
  createCashQuantity,
  quantityTypes,
} = require('../entities/cash-quantity');

function HelloTess({
  transRepo,
  billStockRepo,
  billAssumptionRepo,
  billTakingRepo,
}) {
  async function SetSendStatus(transactions, machineId, serviceKey) {
    await transRepo.connect();
    transactions.forEach(async (transaction) => {
      const updateTransaction = {
        machineId,
        serviceKey,
        ...transaction,
      };
      await transRepo.update(updateTransaction, { send: true });
    });
  }

  async function IncreaseBillAssumption(transactionData) {
    if (!transactionData) {
      throw Error('No transaction data passed.');
    }
    const transaction = createTransaction(transactionData);
    const { paymentType } = transaction.getData();
    if (paymentType !== 'cash') {
      const billAssumption = await billAssumptionRepo.get(
        transaction.getKeys()
      );
      return billAssumption;
    }
    const billAssumption = await billAssumptionRepo.increase(
      transaction
    );
    return billAssumption;
  }

  async function SaveBillTaking(billTakingData) {
    const billTaking = await billTakingRepo.add(billTakingData);
    return billTaking;
  }

  async function SendBillTaking(newBillTaking) {
    try {
      const { machineId, cashQuantities } = newBillTaking;
      await SaveBillTaking(newBillTaking);
      const options = prepareCashQuantitieOptions();
      const time = newBillTaking.cashQuantities[0].date;
      const date = newBillTaking.cashQuantities[0].time;
      const data = prepareCashQuantitieJsonObj(
        machineId,
        time,
        date,
        [],
        cashQuantities
      );

      console.log(data);

      const isHttps = JSON.parse(process.env.HELLO_TESS_HTTPS);
      if (isHttps) {
        const response = await SendHttps({ data, options });
        return response;
      }
      const response = await SendHttp({ data, options });
      return response;
    } catch (error) {
      console.log(error);
      throw new Error(500);
    }
  }
  async function SaveTransaction(transactionData) {
    const saved = await transRepo.add(transactionData);
    return saved;
  }

  async function SaveBillStock(billStock) {
    await billStockRepo.connect();
    await billStockRepo.add(billStock);
    return 200;
  }

  async function GetOpenTransactions(machineId) {
    await transRepo.connect();
    const openTransactions = await transRepo.get(
      { machineId, send: false },
      { _id: 0, machineId: 0, serviceKey: 0 }
    );
    return openTransactions;
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

  async function PrepareBillAssumption({
    serviceKey,
    machineId,
    date,
    time,
  }) {
    await billAssumptionRepo.connect();
    const getResult = await billAssumptionRepo.get(
      { serviceKey, machineId },
      { _id: 0, detail: 1, total: 1 }
    );
    if (getResult.length === 0) return undefined;
    return {
      date,
      time,
      type: 'bill assumption',
      paymentType: 'cash',
      total: getResult[0].total,
      detail: getResult[0].detail,
    };
  }

  async function SendCashQuantities(newBillStock) {
    try {
      await this.SaveBillStock(newBillStock);
      const { machineId, serviceKey, cashQuantities } = newBillStock;
      const transactions = await GetOpenTransactions(machineId);
      const time = newBillStock.cashQuantities[0].date;
      const date = newBillStock.cashQuantities[0].time;
      cashQuantities.push(
        await PrepareBillAssumption({
          serviceKey,
          machineId,
          date,
          time,
        })
      );
      const options = prepareCashQuantitieOptions();
      const data = prepareCashQuantitieJsonObj(
        machineId,
        time,
        date,
        transactions,
        cashQuantities
      );

      console.log(data);

      const isHttps = JSON.parse(process.env.HELLO_TESS_HTTPS);
      if (isHttps) {
        const response = await SendHttps({ data, options });
        await SetSendStatus(transactions, machineId, serviceKey);
        return response;
      }
      const response = await SendHttp({ data, options });
      await SetSendStatus(transactions, machineId, serviceKey);
      return response;
    } catch (error) {
      console.log(error);
      throw new Error(500);
    }
  }

  return {
    SendCashQuantities,
    SendBillTaking,
    SaveTransaction,
    SaveBillStock,
    SaveBillTaking,
    IncreaseBillAssumption,
    PrepareBillAssumption,
  };
}

module.exports = HelloTess;

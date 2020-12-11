const http = require('http');

function HelloTess({
  transRepo,
  billStockRepo,
  billAssumtionRepo,
  billTakingRepo,
}) {
  async function SetSendStatus(transactions, machineId, serviceKey) {
    await transRepo.connect();
    transactions.forEach(async (transaction) => {
      const updateTransaction = { machineId, serviceKey, ...transaction };
      await transRepo.update(updateTransaction, { send: true });
    });
  }

  async function SaveBillAssumtion(transaction) {
    if (transaction.paymentType !== 'cash') return;
    const { serviceKey, machineId, amount } = transaction;
    await billAssumtionRepo.connect();
    await billAssumtionRepo.add({ serviceKey, machineId, value: amount });
  }

  async function SaveBillTaking(billTaking) {
    const { serviceKey, machineId, cashQuantities } = billTaking;
    const tmpQuantities = cashQuantities.map((quantity) => {
      return { ...quantity, send: true };
    });
    await billTakingRepo.connect();
    await billTakingRepo.add({
      serviceKey,
      machineId,
      cashQuantities: tmpQuantities,
    });
    return 200;
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

      return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
          res.on('data', async (respData) => {
            if (res.statusCode === 200) {
              resolve(respData.toString());
            }
            reject(new Error(res.statusCode));
          });
        });

        req.on('error', (error) => {
          reject(error);
        });

        req.write(data);
        req.end();

        setTimeout(() => {
          reject(new Error(408));
        }, 5000);
      });
    } catch (error) {
      console.log(error);
      throw new Error(500);
    }
  }
  async function SaveTransaction(transaction) {
    const tmpTransaction = transaction;
    tmpTransaction.send = false;
    await transRepo.connect();
    await transRepo.add(tmpTransaction);
    await SaveBillAssumtion(tmpTransaction);
    return 200;
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
      hostname: 'gwn.staging.hellotess.com',
      // port: 4001,
      path: '/cardServices/loadExternalData',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  async function PrepareBillAssumtion({ serviceKey, machineId, date, time }) {
    await billAssumtionRepo.connect();
    const getResult = await billAssumtionRepo.get(
      { serviceKey, machineId },
      { _id: 0, detail: 1, total: 1 }
    );
    if (getResult.length === 0) return undefined;
    return {
      date,
      time,
      type: 'bill assumtion',
      paymentType: 'cash',
      total: getResult[0].total,
      detail: getResult[0].detail,
    };
  }

  async function SendCashQuantities(newBillStock) {
    try {
      await SaveBillStock(newBillStock);
      const { machineId, serviceKey, cashQuantities } = newBillStock;
      const transactions = await GetOpenTransactions(machineId);
      const time = newBillStock.cashQuantities[0].date;
      const date = newBillStock.cashQuantities[0].time;
      await billTakingRepo.connect();
      // const [billTaking] = await billTakingRepo.get(
      //   { serviceKey, machineId, 'cashQuantities.send': false },
      //   { _id: 0, 'cashQuantities.$': 1 }
      // );
      //if (billTaking) cashQuantities.push(billTaking.cashQuantities);
      cashQuantities.push(
        await PrepareBillAssumtion({ serviceKey, machineId, date, time })
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

      return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
          res.on('data', async (respData) => {
            if (res.statusCode === 200) {
              await SetSendStatus(transactions, machineId, serviceKey);
              resolve(respData.toString());
            }
            reject(new Error(res.statusCode));
          });
        });

        req.on('error', (error) => {
          reject(error);
        });

        req.write(data);
        req.end();

        setTimeout(() => {
          reject(new Error(408));
        }, 5000);
      });
    } catch (error) {
      console.log(error);
      throw new Error(500);
    }
  }

  return {
    SaveTransaction,
    SendCashQuantities,
    SaveBillStock,
    SaveBillAssumtion,
    SaveBillTaking,
    SendBillTaking,
    PrepareBillAssumtion,
  };
}

module.exports = HelloTess;

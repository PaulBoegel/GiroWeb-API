const http = require('http');

function HelloTessService({transRepo, cashQuantityRepo, billStockRepo}) {

  async function SetSendStatus(transactions, machineId, serviceKey) {
    await cashQuantityRepo.connect();
    transactions.forEach(async (transaction) => {
      const updateTransaction = { machineId, serviceKey, ...transaction };
      await transRepo.update(updateTransaction, { send: true });
    });
  }

  async function SaveBillStock(transaction){
    if(transaction.paymentType !== "cash") return;
    const {serviceKey, machineId, amount} = transaction;
    await billStockRepo.connect();
    await billStockRepo.add({serviceKey, machineId, value: amount}); 
  }

  async function SaveTransaction(transaction) {
    const tmpTransaction = transaction;
    tmpTransaction.send = false;
    await transRepo.connect();
    await transRepo.add(tmpTransaction);
    await SaveBillStock(tmpTransaction);
    return 200;
  }

  async function SaveCashQuantities(quantity) {
    await cashQuantityRepo.connect();
    await cashQuantityRepo.add(quantity);
    return 200;
  }

  async function GetOpenTransactions(machineId) {
    await transRepo.connect();
    const openTransactions = await transRepo.get(
      { machineId, send: false },
      { _id: 0, machineId: 0, serviceKey: 0, send: 0 }
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
      path: '/cardServices/loadExternalData',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  async function PrepareBillStock({serviceKey, machineId, date, time}){
    await billStockRepo.connect()
    const getResult = await billStockRepo.get({serviceKey, machineId}, {_id: 0, detail: 1, total: 1});
    return {
    date,
    time,
    type: "bill assumption",
    paymentType: "cash",
    total: getResult[0].total,
    detail: getResult[0 ].detail
    }
  }

  async function SendCashQuantities(newQuantitieData) {
    try {
      await SaveCashQuantities(newQuantitieData);
      const { machineId, serviceKey, cashQuantities } = newQuantitieData;
      const transactions = await GetOpenTransactions(machineId);
      const time = newQuantitieData.cashQuantities[0].date;
      const date = newQuantitieData.cashQuantities[0].time;
      cashQuantities.push(await PrepareBillStock({serviceKey, machineId, date, time}))
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

  return { SaveTransaction, SendCashQuantities, SaveCashQuantities, SaveBillStock, PrepareBillStock };
}

module.exports = HelloTessService;

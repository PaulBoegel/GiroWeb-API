const http = require('http');
const TransactionRepository = require('../repositories/transactionRepository');
const CashQuantityRepository = require('../repositories/cashQuantityRepository');

function TestService(dbConfig) {
  const transRepo = new TransactionRepository(dbConfig);
  const cashQuantityRepo = new CashQuantityRepository(dbConfig);
  function checkError(code) {
    switch (code) {
      case 500:
        return true;
      default:
        return false;
    }
  }

  async function SetSendStatus(transactions, machineId, serviceKey) {
    await cashQuantityRepo.connect();
    transactions.forEach(async (transaction) => {
      const updateTransaction = { machineId, serviceKey, ...transaction };
      await transRepo.update(updateTransaction, { send: true });
    });
  }

  async function SaveTransaction(transaction) {
    const tmpTransaction = transaction;
    tmpTransaction.send = false;
    await transRepo.connect();
    await transRepo.add(tmpTransaction);
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
      { _id: 0, machineId: 0, serviceKey: 0 }
    );
    return openTransactions;
  }

  async function SendCashQuantities(newQuantitieData) {
    try {
      await SaveCashQuantities(newQuantitieData);
      const { machineId, serviceKey, cashQuantities } = newQuantitieData;

      const transactions = await GetOpenTransactions(machineId);

      return new Promise((resolve, reject) => {
        const headerTmp = {
          type: 'data',
          name: 'audit',
          version: '1.0',
          machineId,
          date: newQuantitieData.cashQuantities[0].date,
          time: newQuantitieData.cashQuantities[0].time,
        };

        const data = JSON.stringify({
          header: headerTmp,
          body: {
            transactions,
            cashQuantities,
          },
        });

        const options = {
          hostname: 'localhost',
          port: 4001,
          path: '/cashQuantities',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        };

        const req = http.request(options, (res) => {
          res.on('data', async (respData) => {
            if (checkError(res.statusCode)) {
              reject(new Error(res.statusCode));
              return;
            }
            await SetSendStatus(transactions, machineId, serviceKey);
            resolve(respData.toString());
          });
        });

        console.log(data);

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

  return { SaveTransaction, SendCashQuantities };
}

module.exports = TestService;

const http = require('http');
const TransactionRepository = require('../repositories/transactionRepository');
const CashQuantityRepository = require('../repositories/cashQuantityRepository');

function HelloTessService(dbConfig) {
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
      { _id: 0, machineId: 0, serviceKey: 0, send: 0 }
    );
    return openTransactions;
  }

  async function SendCashQuantities(newQuantitieData) {
    try {
      const { machineId, serviceKey, cashQuantities } = newQuantitieData;

      await SaveCashQuantities(newQuantitieData);
      const transactions = await GetOpenTransactions(machineId);

      return new Promise((resolve, reject) => {
        const headerTmp = {
          type: 'data',
          name: 'audit',
          version: '1.0',
          machineId,
          date: cashQuantities[0].date,
          time: cashQuantities[0].time,
        };

        const data = JSON.stringify({
          header: headerTmp,
          body: {
            transactions,
            cashQuantities,
          },
        });

        const options = {
          hostname: 'gwn.staging.hellotess.com',
          path: '/cardServices/loadExternalData',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        };

        console.log(data);

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

module.exports = HelloTessService;

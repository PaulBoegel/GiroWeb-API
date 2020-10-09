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

  async function SetSendStatus(transactions, machineID, serviceKey) {
    await cashQuantityRepo.connect();
    transactions.forEach(async (transaction) => {
      const updateTransaction = { machineID, serviceKey, ...transaction };
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

  async function GetOpenTransactions(machineID) {
    await transRepo.connect();
    const openTransactions = await transRepo.get(
      { machineID, send: false },
      { _id: 0, machineID: 0, serviceKey: 0 }
    );
    return openTransactions;
  }

  async function SendCashQuantities(newQuantitieData) {
    try {
      await SaveCashQuantities(newQuantitieData);
      const {
        machineID,
        serviceKey,
        date,
        time,
        cashQuantities,
      } = newQuantitieData;

      const transactions = await GetOpenTransactions(machineID);

      return new Promise((resolve, reject) => {
        const headerTmp = {
          type: 'data',
          name: 'audit',
          version: '1.0',
          machineID,
          date,
          time,
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
            await SetSendStatus(transactions, machineID, serviceKey);
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

module.exports = TestService;

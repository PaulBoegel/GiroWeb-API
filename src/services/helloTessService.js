const http = require('http');
const TransactionRepository = require('../repositories/transactionRepository');

function HelloTessService(dbConfig) {
  function checkError(code) {
    switch (code) {
      case 500:
        return true;
      default:
        return false;
    }
  }

  async function SaveTransaction(machineID, transaction) {
    const transRepo = new TransactionRepository(dbConfig);
    await transRepo.connect();
    await transRepo.add(transaction);
    return 200;
  }

  function SaveCashQuantities(machineID, quantities) {
    return new Promise((resolve, reject) => {
      const headerTmp = {
        type: 'data',
        name: 'audit',
        version: '1.0',
        machineId: machineID,
        date: quantities.date,
        time: quantities.time,
      };

      const data = JSON.stringify({
        header: headerTmp,
        body: {
          // transactions: [transaction]
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

      const req = http.request(options, (res) => {
        res.on('data', (respData) => {
          if (checkError(res.statusCode)) {
            reject(new Error(res.statusCode));
          }
          resolve(respData.toString());
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      console.log(data);
      req.write(data);
      req.end();

      setTimeout(() => {
        reject(new Error(408));
      }, 5000);
    });
  }

  return { SaveTransaction, SaveCashQuantities };
}

module.exports = HelloTessService;

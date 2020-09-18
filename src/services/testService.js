const http = require('http');

function TestService() {
  function checkError(code) {
    switch (code) {
      case 500:
        return true;
      default:
        return false;
    }
  }

  function SaveTransaction(machineID, transaction) {
    return new Promise((resolve, reject) => {
      const headerTmp = {
        type: 'data',
        name: 'audit',
        version: '1.0',
        machineId: machineID,
      };

      const data = JSON.stringify({
        header: headerTmp,
        body: {
          transactions: [transaction],
        },
      });

      const options = {
        hostname: 'localhost',
        port: '4001',
        path: '/logicError',
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
        console.log(error);
        reject();
      });

      req.write(data);
      req.end();

      setTimeout(() => {
        reject(new Error(408));
      }, 5000);
    });
  }

  return { SaveTransaction };
}

module.exports = TestService;

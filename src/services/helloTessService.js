const http = require('http');

function HelloTessService() {
  function SaveTransaction(transaction) {
    const headerTmp = {
      type: 'data',
      name: 'audit',
      version: '1.0',
      machineId: transaction.machineId,
    };

    const data = JSON.stringify({
      header: headerTmp,
      body: {
        transactions: [transaction],
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
      console.log(`statusCode: ${res.statusCode}`);

      res.on('data', (respData) => {
        console.log(respData.toString());
      });
    });

    req.on('error', (error) => {
      console.log(error);
    });

    req.write(data);
    req.end();
  }

  return { SaveTransaction };
}

module.exports = HelloTessService;

const http = require('http');
const https = require('https');

function _send({ protocol, data, options }) {
  return new Promise((resolve, reject) => {
    const req = protocol.request(options, (res) => {
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
    }, parseInt(process.env.REQUEST_TIMEOUT));
  });
}

exports.SendHttp = ({ data, options }) => {
  return _send({ protocol: http, data, options });
};

exports.SendHttps = ({ data, options }) => {
  return _send({ protocol: https, data, options });
};

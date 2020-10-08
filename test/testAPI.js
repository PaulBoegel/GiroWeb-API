const server = require('http').createServer();

server.on('request', (req, res) => {
  switch (req.url) {
    case '/success':
      res.writeHeader(200);
      res.end('success');
      break;
    case '/logicError':
      res.writeHeader(200);
      res.end('error');
      break;
    case '/timeout':
      setTimeout(() => {
        res.writeHeader(200);
        res.end('timeout ends');
      }, 10000);
      break;
    case '/error':
      res.writeHeader(500);
      res.end('Internal Server Error');
      break;
    case '/cashQuantities':
      res.writeHeader(200);
      break;
    default:
      res.writeHeader(404);
      res.end();
      break;
  }

  let body = [];
  req.on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    res.setHeader = {'Content-Type': 'application/json'}
    res.write(body);
    res.end(body);
  })
});

server.listen(4001);

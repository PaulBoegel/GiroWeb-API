const server = require('http').createServer();

server.on('request', (req, res) => {
  console.log(req.url);
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
    default:
      res.writeHeader(404);
      res.end();
      break;
  }
});

server.listen(4001);

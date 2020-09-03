const HelloTessService = require('./services/helloTessService');

function GirowebServiceFactory() {
  function CreateService(key) {
    switch (key) {
      case 'HelloTess':
        return new HelloTessService();
      default:
        return null;
    }
  }

  return { CreateService };
}

module.exports = GirowebServiceFactory;

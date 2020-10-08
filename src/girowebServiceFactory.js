const TestService = require('./services/testService');
const HelloTessService = require('./services/helloTessService');

function GirowebServiceFactory(dbConfig) {
  function CreateService(key) {
    switch (key) {
      case 'HelloTess':
        return new HelloTessService(dbConfig);
      case 'Test':
        return new TestService(dbConfig);
      default:
        return null;
    }
  }

  return { CreateService };
}

module.exports = GirowebServiceFactory;

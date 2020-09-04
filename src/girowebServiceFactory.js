const TestService = require('./services/testService');
const HelloTessService = require('./services/helloTessService');

function GirowebServiceFactory() {
  function CreateService(key) {
    switch (key) {
      case 'HelloTess':
        return new HelloTessService();
      case 'Test':
        return new TestService();
      default:
        return null;
    }
  }

  return { CreateService };
}

module.exports = GirowebServiceFactory;

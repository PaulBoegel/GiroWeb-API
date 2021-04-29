const TestService = require('./services/testService');
const HelloTessService = require('./services/helloTessService');

function GirowebServiceFactory(repos) {
  function CreateService(key) {
    switch (key) {
      case 'HelloTess':
        return new HelloTessService(repos);
      case 'Test':
        return new TestService(repos);
      default:
        return null;
    }
  }

  return { CreateService };
}

module.exports = GirowebServiceFactory;

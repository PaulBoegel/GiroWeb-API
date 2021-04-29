const TestService = require('./services/testService');
const HelloTessService = require('./services/helloTessService');

function ServiceFactory(repos) {
  function CreateService(key) {
    switch (key) {
      case 'HelloTess':
        return new HelloTessService(repos);
      case 'Test':
        return new TestService(repos);
      default:
        return undefined;
    }
  }

  return { CreateService };
}

module.exports = ServiceFactory;

const TestService = require('./services/testService');
const HelloTessService = require('./services/helloTessService');
const HELLO_TESS = 'HelloTess';
const TEST = 'Test';
function ServiceFactory(repos) {
  function CreateService(key) {
    switch (key) {
      case HELLO_TESS:
        return HelloTessService(repos);
      case TEST:
        return TestService(repos);
      default:
        return undefined;
    }
  }

  return { CreateService, HELLO_TESS, TEST };
}

module.exports = ServiceFactory;

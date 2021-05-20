const HelloTessService = require('./services/helloTessService');

const HELLO_TESS = 'HelloTess';
function ServiceFactory(repos) {
  function CreateService(key) {
    switch (key) {
      case HELLO_TESS:
        return HelloTessService(repos);
      default:
        return undefined;
    }
  }

  return { CreateService, HELLO_TESS };
}

module.exports = ServiceFactory;

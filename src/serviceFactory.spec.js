const expect = require('chai').expect;
const ServiceFactory = require('./serviceFactory');
describe('serviceFactory', () => {
  describe('CreateService', () => {
    let serviceFactory, repos;
    beforeEach(() => {
      repos = {
        transRepo: {},
        billStockRepo: {},
        billTakingRepo: {},
        billAssumtionRepo: {},
      };
      serviceFactory = ServiceFactory(repos);
    });
    it('should create all services', () => {
      const serviceNames = [serviceFactory.HELLO_TESS, serviceFactory.TEST];
      serviceNames.forEach((name) => {
        const service = serviceFactory.CreateService(name);
        expect(service).to.have.property('SaveTransaction');
      });
    });
    it('should return undefined if no service is available for the determined key', () => {
      const service = serviceFactory.CreateService('none');
      expect(service).to.be.undefined;
    });
  });
});

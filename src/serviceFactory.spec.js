const { expect } = require('chai');
const ServiceFactory = require('./serviceFactory');

describe('serviceFactory', () => {
  describe('CreateService', () => {
    let serviceFactory;
    let repos;
    beforeEach(() => {
      repos = {
        transRepo: {},
        billStockRepo: {},
        billTakingRepo: {},
        billAssumptionRepo: {},
      };
      serviceFactory = ServiceFactory(repos);
    });
    it('should create all services', () => {
      const serviceNames = [serviceFactory.HELLO_TESS];
      serviceNames.forEach((name) => {
        const service = serviceFactory.CreateService(name);
        expect(service).to.be.an('object');
      });
    });
    it('should return undefined if no service is available for the determined key', () => {
      const service = serviceFactory.CreateService('none');
      expect(service).to.be.an('undefined');
    });
  });
});

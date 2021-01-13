const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
const HelloTessService = require('../../src/services/helloTessService');
chai.use(require('chai-as-promised'));

describe('HelloTessService SendCashQuantities', () => {
  it('should return Error 500 with empty dependencies', async () => {
    const transRepo = {};
    const billStockRepo = {};
    const billAssumtionRepo = {};
    const billTakingRepo = {};

    const service = HelloTessService({
      transRepo,
      billStockRepo,
      billAssumtionRepo,
      billTakingRepo,
    });

    try {
      await service.SendCashQuantities({});
    } catch (error) {
      error.should.be.Error();
    }
  });
});

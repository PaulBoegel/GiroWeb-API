const sinon = require('sinon');
const chai = require('chai');
const HelloTessService = require('../../src/services/helloTessService');
const cashQuantity = require('../mocks/cashQuantityMock.json');
const http = require('http');
const https = require('https');
const { stub } = require('sinon');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

describe('HelloTessService SendCashQuantities', () => {
  it('should use the right send protocol', async () => {
    const transRepo = {
      connect() {},
      get() {
        return [];
      },
    };
    const billAssumtionRepo = {
      connect() {},
      get() {
        return [];
      },
    };

    const service = HelloTessService({
      transRepo,
      billAssumtionRepo,
    });

    const testService = Object.assign(service, {
      SaveBillStock() {
        return 200;
      },
      PrepareBillAssumtion() {
        return {};
      },
    });

    let resStub;
    resHttp = http.ServerResponse;
    resHttp.statusCode = 200;
    resStub = stub(resHttp, 'on').yields('HTTPS');
    stub(https, 'request').yields(resHttp);

    process.env.HELLO_TESS_HTTPS = 'true';
    let result = await testService.SendCashQuantities(cashQuantity);
    expect(result).to.be.equal('HTTPS');

    resStub.restore();
    resStub = stub(resHttp, 'on').yields('HTTP');
    stub(http, 'request').yields(resHttp);

    process.env.HELLO_TESS_HTTPS = 'false';
    result = await testService.SendCashQuantities(cashQuantity);
    expect(result).to.be.equal('HTTP');
  });
});

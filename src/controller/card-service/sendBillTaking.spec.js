const { expect } = require('chai');
const {
  createCashQuantity,
} = require('../../entities/cash-quantity');
const createFakeCashQuantity = require('../../../__test__/fixtures/cashQuantity');
const createSendBillTaking = require('./sendBillTaking');

describe('sendBillTaking', () => {
  let createService;
  beforeEach(() => {
    createService = () => {
      return {
        SaveBillTaking: async () => {
          return {
            getKeys: () => {},
            getData: () => {},
          };
        },
      };
    };
  });

  it('should be a function', async () => {
    const SendBillTaking = createSendBillTaking({ createService });
    expect(SendBillTaking).to.be.a('function');
  });

  it('should return a response object, with header, body and status code property', async () => {
    const SendBillTaking = createSendBillTaking({
      createService,
    });
    const request = {
      body: {
        serviceKey: 'Test',
      },
    };
    const result = await SendBillTaking(request);
    expect(result).to.be.an('object');
    expect(result.headers).to.be.an('object');
    expect(result.body).to.be.an('object');
    expect(result.statusCode).to.be.a('number');
  });

  it('should return status code 200 if the request was right', async () => {
    const SendBillTaking = createSendBillTaking({
      createService,
    });
    const request = {
      body: {
        serviceKey: 'Test',
        machineId: 100,
        cashQuantities: [createFakeCashQuantity({})],
      },
    };
    const result = await SendBillTaking(request);
    expect(result.statusCode).eql(200);
  });

  it('should return a response object, with header, body and status code if an error occurred', async () => {
    createService = () => {
      return {
        GetBillTakingData: async () => {
          throw new Error('Transaction Error');
        },
      };
    };
    const saveTransaction = createSendBillTaking({
      createService,
    });
    const request = {
      body: {
        serviceKey: 'Test',
      },
    };
    const result = await saveTransaction(request);
    expect(result).to.be.an('object');
    expect(result.headers).to.be.an('object');
    expect(result.body).to.be.an('object');
    expect(result.statusCode).to.be.a('number');
  });
});

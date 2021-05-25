const { expect } = require('chai');
const createSaveTransaction = require('./saveTransaction');

describe('saveTransaction', () => {
  let createService;
  beforeEach(() => {
    createService = () => {
      return {
        saveTransaction: async () => {
          return {};
        },
      };
    };
  });

  it('should be a function', async () => {
    const saveTransaction = createSaveTransaction({ createService });
    expect(saveTransaction).to.be.a('function');
  });

  it('should return a response object, with header, body and status code property', async () => {
    const saveTransaction = createSaveTransaction({
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

  it('should return status code 200 if the request was right', async () => {
    const saveTransaction = createSaveTransaction({
      createService,
    });
    const request = {
      body: {
        serviceKey: 'Test',
      },
    };
    const result = await saveTransaction(request);
    expect(result.statusCode).eql(200);
  });

  it('should return a response object, with header, body and status code if an error occurred', async () => {
    createService = () => {
      return {
        saveTransaction: async () => {
          throw new Error('Transaction Error');
        },
      };
    };
    const saveTransaction = createSaveTransaction({
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

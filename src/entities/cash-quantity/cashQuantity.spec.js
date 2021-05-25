const { expect } = require('chai');
const createFakeCashQuantity = require('../../../__test__/fixtures/cashQuantity');
const { createCashQuantity } = require('./index');

describe('cashQuantity', () => {
  it('must be an object', async () => {
    const cashQuantity = createFakeCashQuantity({});
    expect(createCashQuantity(cashQuantity)).to.be.an('object');
  });
  it('must have a service key', async () => {
    const cashQuant = createFakeCashQuantity({ serviceKey: null });
    expect(() => createCashQuantity(cashQuant)).to.throw(
      'Cash quantity must have a service key.'
    );
  });
  it('must have a machine id', async () => {
    const cashQuant = createFakeCashQuantity({ machineId: null });
    expect(() => createCashQuantity(cashQuant)).to.throw(
      'Cash quantity must have a machine id.'
    );
  });
  it('must have a payment type', async () => {
    const cashQuant = createFakeCashQuantity({ paymentType: null });
    expect(() => createCashQuantity(cashQuant)).to.throw(
      'Cash quantity must have a payment type.'
    );
  });
  it('must have a total value', async () => {
    const cashQuantity = createFakeCashQuantity({ total: null });
    expect(() => createCashQuantity(cashQuantity)).to.throw(
      'Cash quantity must have a total value.'
    );
  });
  it('must except a total value of 0', async () => {
    const cashQuantity = createFakeCashQuantity({ total: 0 });
    expect(() => createCashQuantity(cashQuantity)).to.not.throw();
  });
  it('must have a valid type', async () => {
    const cashQuant = createFakeCashQuantity({ type: null });
    expect(() => createCashQuantity(cashQuant)).to.throw(
      'Cash quantity must have a valid type.'
    );
  });
  it('must have a date with DD.MM.YYYY format', async () => {
    const badCashQuantity = createFakeCashQuantity({
      date: '05/18/2021',
    });
    const rightCashQuantity = createFakeCashQuantity({});
    expect(() => createCashQuantity(badCashQuantity)).to.throw(
      'Date format is not DD.MM.YYYY.'
    );
    expect(() => createCashQuantity(rightCashQuantity)).not.throw();
  });
  it('must have a time with HH:mm:ss format', async () => {
    const badCashQuantity = createFakeCashQuantity({ time: '10-45' });
    const rightCashQuantity = createFakeCashQuantity({
      time: '18:40:55',
    });
    expect(() => createCashQuantity(badCashQuantity)).to.throw(
      'Time format is not HH:mm:ss.'
    );
    expect(() => createCashQuantity(rightCashQuantity)).not.throw();
  });
  it('must have valid detail information', () => {
    const cashQuants = [
      createFakeCashQuantity({ detail: null }),
      createFakeCashQuantity({
        detail: [{ value: 500, total: 0, quantity: 0 }],
      }),
      createFakeCashQuantity({ detail: [{}, {}, {}, {}] }),
    ];
    cashQuants.forEach((cashQuantity) => {
      expect(() => createCashQuantity(cashQuantity)).to.throw(
        'Cash quantity must have valid detail information.'
      );
    });
  });
});

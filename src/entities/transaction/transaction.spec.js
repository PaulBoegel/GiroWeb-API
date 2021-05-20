const { expect } = require('chai');
const makeFakeTransaction = require('../../../__test__/fixtures/transaction');
const createTransaction = require('./index');

describe('transaction', () => {
  it('must be an object', async () => {
    const transaction = makeFakeTransaction({});
    expect(createTransaction(transaction)).to.be.an('object');
  });
  it('must have a machine id', async () => {
    const transaction = makeFakeTransaction({ machineId: null });
    expect(() => createTransaction(transaction)).to.throw(
      'Transaction must have a machine id.'
    );
  });

  it('must have a service key', async () => {
    const transaction = makeFakeTransaction({ serviceKey: null });
    expect(() => createTransaction(transaction)).to.throw(
      'Transaction must have a service key.'
    );
  });

  it('must have a card id', async () => {
    const transaction = makeFakeTransaction({ cardId: null });
    expect(() => createTransaction(transaction)).to.throw(
      'Transaction must have a card id.'
    );
  });
  it('must have a payment type', async () => {
    const transaction = makeFakeTransaction({ paymentType: null });
    expect(() => createTransaction(transaction)).to.throw(
      'Transaction must have a payment type.'
    );
  });
  it('must have an amout', async () => {
    const transaction = makeFakeTransaction({ amount: null });
    expect(() => createTransaction(transaction)).to.throw(
      'Transaction must have an amount.'
    );
  });
  it('must have a transaction count', async () => {
    const transaction = makeFakeTransaction({
      transactionCount: null,
    });
    expect(() => createTransaction(transaction)).to.throw(
      'Transaction must have a transaction count.'
    );
  });
  it('must have a date with DD.MM.YYYY format', async () => {
    const badTransaction = makeFakeTransaction({
      date: '05/18/2021',
    });
    const rightTransaction = makeFakeTransaction({});
    expect(() => createTransaction(badTransaction)).to.throw(
      'Date format is not DD.MM.YYYY.'
    );
    expect(() => createTransaction(rightTransaction)).not.throw();
  });
  it('must have a time with HH:mm format', async () => {
    const badTransaction = makeFakeTransaction({ time: '10-45' });
    const rightTransaction = makeFakeTransaction({ time: '18:40' });
    expect(() => createTransaction(badTransaction)).to.throw(
      'Time format is not HH:mm.'
    );
    expect(() => createTransaction(rightTransaction)).not.throw();
  });
  it('must have a send status', async () => {
    const transaction = makeFakeTransaction({ send: null });
    expect(() => createTransaction(transaction)).to.throw(
      'Transaction must have a send status.'
    );
  });
});

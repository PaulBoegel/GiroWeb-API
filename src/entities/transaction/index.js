const dateTimeValidator = require('../../helper/dateTimeValidator');
const buildCreateTransaction = require('./transaction');

const createTransaction = buildCreateTransaction({
  dateTimeValidator,
});
module.exports = createTransaction;

const buildCreateCashQuantity = require('./cashQuantity');
const dateTimeValidator = require('../../helper/dateTimeValidator');

const quantityTypes = Object.freeze({
  BILL_ASSUMPTION: 'bill assumption',
  BILL_TAKING: 'bill taking',
  BILL_STOCK: 'bill stock',
});

const createCashQuantity = buildCreateCashQuantity({
  dateTimeValidator,
  typeCheck,
});
module.exports = { createCashQuantity, quantityTypes };

function typeCheck(type) {
  const typeFound = Object.entries(quantityTypes).find(
    ([, typeName]) => typeName === type
  );
  if (typeFound) return true;
  return false;
}

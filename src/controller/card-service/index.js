const createSaveTransaction = require('./saveTransaction');
const createSendBillTaking = require('./sendBillTaking');
const createSendCashQuantities = require('./sendCashQuantities');
const createService = require('../../services');

module.exports = {
  SaveTransaction: createSaveTransaction({ createService }),
  SendBillTaking: createSendBillTaking({ createService }),
  SendCashQuantities: createSendCashQuantities({ createService }),
};

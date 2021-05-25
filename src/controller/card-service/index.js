const createSaveTransaction = require('./saveTransaction');
const serviceFactory = require('../../services/serviceFactory');

module.exports = {
  SaveTransaction: createSaveTransaction({ serviceFactory }),
};

const dateAndTime = require('date-and-time');

module.exports = function dateTimeValidator(date, format) {
  return dateAndTime.isValid(date, format);
};

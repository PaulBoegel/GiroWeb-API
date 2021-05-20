module.exports = function buildCreateCashQuantity({
  dateTimeValidator,
  typeCheck,
}) {
  return function createCashQuantity({
    serviceKey,
    machineId,
    date,
    time,
    type,
    paymentType,
    total,
    detail,
  }) {
    if (!machineId) {
      throw new Error('Cash quantity must have a machine id.');
    }
    if (!serviceKey) {
      throw new Error('Cash quantity must have a service key.');
    }
    if (!paymentType) {
      throw new Error('Cash quantity must have a payment type.');
    }
    if (total === undefined || total === null) {
      throw new Error('Cash quantity must have a total value.');
    }
    if (!dateTimeValidator(date, 'DD.MM.YYYY')) {
      throw new Error('Date format is not DD.MM.YYYY.');
    }
    if (!dateTimeValidator(time, 'HH:mm')) {
      throw new Error('Time format is not HH:mm.');
    }

    if (!typeCheck(type)) {
      throw new Error('Cash quantity must have a valid type.');
    }

    if (!isDetailValid(detail)) {
      throw new Error(
        'Cash quantity must have valid detail information.'
      );
    }

    return Object.freeze({
      getKeys: () => {
        return { serviceKey, machineId, date, time };
      },
      getData: () => {
        return { type, paymentType, total, detail };
      },
      getDetailEntry: (index) => {
        if (index > 3 || index === undefined || index === null)
          return undefined;
        return detail[index];
      },
    });
  };
};

function entryPropertieCheck(entry) {
  const { length } = Object.entries(entry).filter(([fieldname]) =>
    ['value', 'quantity', 'total'].includes(fieldname)
  );
  return Boolean(length);
}

function isDetailValid(detail) {
  if (detail instanceof Array === false) return false;
  if (detail.length !== 4) return false;

  const unvalidEntrys = detail.filter(
    (entry) => !entryPropertieCheck(entry)
  );

  if (unvalidEntrys.length > 0) return false;

  return true;
}

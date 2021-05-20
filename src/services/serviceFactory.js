module.exports = function serviceFactory({
  services,
  transRepo,
  billStockRepo,
  billAssumptionRepo,
  billTakingRepo,
}) {
  return function createService(serviceName) {
    return {
      GetBillingData: services[serviceName].GetBillingData.bind({
        transRepo,
        billStockRepo,
        billAssumptionRepo,
      }),
      GetBillTakingData: services[serviceName].GetBillTakingData.bind(
        {
          billTakingRepo,
        }
      ),
      SaveTransaction: services[serviceName].SaveTransaction.bind({
        transRepo,
      }),
      SaveBillStock: services[serviceName].SaveBillStock.bind({
        billStockRepo,
      }),
      SaveBillTaking: services[serviceName].SaveBillTaking.bind({
        billTakingRepo,
      }),
      IncreaseBillAssumption: services[
        serviceName
      ].IncreaseBillAssumption.bind({ billAssumptionRepo }),
    };
  };
};

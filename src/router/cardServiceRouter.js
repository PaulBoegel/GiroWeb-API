function CardServiceRouter(router, csCtrl) {
  router.route('/cardservice/transaction').post(csCtrl.SaveTransaction);
  router.route('/cardservice/bill-taken').post(csCtrl.SaveBillTaking);
  router.route('/cardservice/cash-quantities').post(csCtrl.SendCashQuantities);

  return router;
}

module.exports = CardServiceRouter;

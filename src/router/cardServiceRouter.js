function CardServiceRouter(router, csCtrl) {
  router.route('/cardservice/transaction').post(csCtrl.SaveTransaction);
  router.route('/cardservice/cash-quantites').post(csCtrl.SaveCashQuantities);

  return router;
}

module.exports = CardServiceRouter;

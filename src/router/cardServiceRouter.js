function CardServiceRouter(router, csCtrl) {
  router.route('/cardService/transaction').post(csCtrl.SaveTransaction);

  return router;
}

module.exports = CardServiceRouter;

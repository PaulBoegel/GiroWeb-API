function CardServiceRouter(router, csCtrl) {
  router.route('/cardservice/transaction').post(csCtrl.SaveTransaction);

  return router;
}

module.exports = CardServiceRouter;

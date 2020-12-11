function CardServiceRouter(router, auth, csCtrl) {
  router
    .route('/cardservice/transaction')
    .post(auth.AuthenticateToken, csCtrl.SaveTransaction);
  router
    .route('/cardservice/bill-taking')
    .post(auth.AuthenticateToken, csCtrl.SendBillTaking);
  router
    .route('/cardservice/cash-quantities')
    .post(auth.AuthenticateToken, csCtrl.SendCashQuantities);

  return router;
}

module.exports = CardServiceRouter;

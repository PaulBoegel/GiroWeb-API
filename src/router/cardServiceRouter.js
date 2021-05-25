function CardServiceRouter(router, auth, csCtrl, callback) {
  router
    .route('/cardservice/transaction')
    .post(auth.AuthenticateToken, callback(csCtrl.SaveTransaction));
  router
    .route('/cardservice/bill-taking')
    .post(auth.AuthenticateToken, callback(csCtrl.SendBillTaking));
  router
    .route('/cardservice/cash-quantities')
    .post(
      auth.AuthenticateToken,
      callback(csCtrl.SendCashQuantities)
    );

  return router;
}

module.exports = CardServiceRouter;

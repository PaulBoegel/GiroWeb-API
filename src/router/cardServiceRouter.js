function CardServiceRouter(router, auth, csCtrl) {
  router
    .route('/cardservice/transaction')
    .post(auth.AuthenticateToken, csCtrl.SaveTransaction);
  router
    .route('/cardservice/bill-taken')
    .post(auth.AuthenticateToken, csCtrl.SaveBillTaking);
  router
    .route('/cardservice/cash-quantities')
    .post(auth.AuthenticateToken, csCtrl.SendCashQuantities);

  return router;
}

module.exports = CardServiceRouter;

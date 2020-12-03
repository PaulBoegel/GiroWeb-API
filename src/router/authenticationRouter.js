function AuthenticationRouter(router, authCtrl) {
  router.route('/authentication').post(authCtrl.Authentication);
  router.route('/refresh-token').post(authCtrl.RefreshToken);

  return router;
}

module.exports = AuthenticationRouter;

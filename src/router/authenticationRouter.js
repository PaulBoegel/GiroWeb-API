function AuthenticationRouter(router, authCtrl) {
  router.route('/authentication').post(authCtrl.Authentication);
  router.route('/authentication-test').post(authCtrl.AuthenticationTest);

  return router;
}

module.exports = AuthenticationRouter;

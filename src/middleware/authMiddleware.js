function AuthMiddleware(jwt) {
  function AuthenticateToken(req, res, next) {
    try {
      const auth = req.body.authorization;
      const token = auth && auth.split(' ')[1];
      if (!token) return res.sendStatus(401);
      jwt.verify(token, process.env.ACCESS_TOKEN_SECTET, (err, machine) => {
        if (err) return res.sendStatus(403);
        req.machine = machine;
        delete req.body['authorization'];
        return next();
      });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
  return { AuthenticateToken };
}

module.exports = AuthMiddleware;

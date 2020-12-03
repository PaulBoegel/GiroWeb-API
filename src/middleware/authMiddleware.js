function AuthMiddleware(jwt) {
  function AuthenticateToken(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) return res.sendStatus(401);
      jwt.verify(token, process.env.ACCESS_TOKEN_SECTET, (err, machine) => {
        if (err) return res.sendStatus(403);
        req.machine = machine;
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

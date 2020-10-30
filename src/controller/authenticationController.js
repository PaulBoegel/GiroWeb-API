function AuthenticationController() {
  function GetErrorCode(error) {
    let code = parseInt(error.message, 10);
    if (Number.isNaN(code)) code = 500;
    return code;
  }

  async function Authentication(req, res) {
    try {
      const token = req.body;
      console.log(token);
      res.send(token);
    } catch (err) {
      const code = GetErrorCode(err);
      res.sendStatus(GetErrorCode(code));
    }
  }

  async function AuthenticationTest(req, res) {
    try {
      const { authorization } = req.headers;
      console.log(authorization);
      res.send(authorization);
    } catch (err) {
      const code = GetErrorCode(err);
      res.sendStatus(GetErrorCode(code));
    }
  }

  return { Authentication, AuthenticationTest };
}

module.exports = AuthenticationController;

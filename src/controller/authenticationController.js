function AuthenticationController({ jwt, authRepository }) {
  function GetErrorCode(error) {
    let code = parseInt(error.message, 10);
    if (Number.isNaN(code)) code = 500;
    return code;
  }

  function generateAccessToken(machine) {
    const { machineId } = machine;
    return jwt.sign({ machineId }, process.env.ACCESS_TOKEN_SECTET, {
      expiresIn: process.env.TOKEN_EXPIRE_TIME,
    });
  }

  function generateRefreshToken(machine) {
    const { machineId } = machine;
    return jwt.sign({ machineId }, process.env.REFRESH_TOKEN_SECRET);
  }

  async function Authentication(req, res) {
    try {
      const { machineId, authKey } = req.body;
      await authRepository.connect();
      const [result] = await authRepository.get(
        { machineId, authKey },
        { _id: 0, authKey: 1 }
      );
      if (authKey === result.authKey) {
        const accessToken = generateAccessToken({ machineId, authKey });
        const refreshToken = generateRefreshToken({ machineId, authKey });
        const result = await authRepository.update({ machineId, refreshToken });
        if (result.matchedCount == 0) throw new Error('500');
        return await res.send({ accessToken, refreshToken });
      }
      res.sendStatus(403);
    } catch (err) {
      const code = GetErrorCode(err);
      res.sendStatus(code);
    }
  }

  async function RefreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      if (refreshToken == null) return res.sendStatus(401);
      await authRepository.connect();
      const count = await authRepository.count({ refreshToken });
      if (count === 0) return res.sendStatus(403);
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, machine) => {
          if (err) return res.sendStatus(403);
          const accessToken = generateAccessToken(machine);
          return res.send({ token: accessToken });
        }
      );
    } catch (err) {
      res.sendStatus(GetErrorCode(err));
    }
  }

  return { Authentication, RefreshToken };
}

module.exports = AuthenticationController;

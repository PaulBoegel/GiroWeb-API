const sinon = require('sinon');
const expect = require('chai').expect;
const AuthenticationController = require('./authenticationController');
describe('authenticationController', () => {
  let authCtrl, jwt, authRepository, req, res, authRepoCountStub;

  beforeEach(() => {
    req = { body: { machineId: 100 } };
    res = {};
    jwt = { sign: () => 'generated-token' };
    authRepository = {
      connect() {},
      get() {
        return new Promise((resolve, reject) => {
          resolve([{ authKey: 12345 }]);
        });
      },
      update() {
        return new Promise((resolve, reject) => {
          resolve({ matchedCount: 1 });
        });
      },
      count() {},
    };
    authCtrl = AuthenticationController({ jwt, authRepository });
    authRepoCountStub = sinon.stub(authRepository, 'count');
  });

  describe('Authentication', () => {
    it('should send status code 403 if authKey not exists', () => {
      req.body.authKey = 123456;
      res.sendStatus = (code) => {
        expect(code).to.be.eq(403);
      };
      return authCtrl.Authentication(req, res);
    });

    it('should send a refresh and access token if authKey exists', () => {
      req.body.authKey = 12345;
      res.send = (result) => {
        expect(result).to.be.eql({
          accessToken: 'generated-token',
          refreshToken: 'generated-token',
        });
      };
      return authCtrl.Authentication(req, res);
    });

    it('should send status code 500 if an exception is thrown', () => {
      res.sendStatus = (code) => {
        expect(code).to.be.eq(500);
      };
      return authCtrl.Authentication(req, res);
    });
  });

  describe('RefreshToken', () => {
    it('should send status code 401 if the refresh token is missing', () => {
      res.sendStatus = (code) => {
        expect(code).to.be.eq(401);
      };
      return authCtrl.RefreshToken(req, res);
    });

    it('should send status code 403 if the refresh token is not saved in database', () => {
      authRepoCountStub.returns(new Promise((resolve, reject) => resolve(0)));
      res.sendStatus = (code) => {
        expect(code).to.be.eq(403);
      };
      req.body.refreshToken = 'token';
      return authCtrl.RefreshToken(req, res);
    });

    it('should send a new access token if the refresh token is saved in database', () => {
      authRepoCountStub.returns(new Promise((resolve, reject) => resolve(1)));
      res.send = (result) => {
        expect(result).to.be.eql({
          token: 'generated-token',
        });
      };
      req.body.refreshToken = 'token';
      jwt.verify = (token, secret, cb) =>
        cb((error = undefined), { machineId: 12345 });
      return authCtrl.RefreshToken(req, res);
    });

    it('should send status code 500 if an exception is thrown', () => {
      res.sendStatus = (code) => {
        expect(code).to.be.eq(500);
      };
      return authCtrl.RefreshToken(req, res);
    });
  });

  afterEach(() => {
    authRepoCountStub.restore();
  });
});

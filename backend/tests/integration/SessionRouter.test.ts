import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import app from '../../app/index';
import { Challenge } from '../../app/models/sql/Challenge';
import { User } from '../../app/models/sql/User';
import { UserService } from '../../app/services/UserService';
import { uniqueEmail } from './helpers';

const PASSWORD = 'DarkraiIsBest123%';

async function testThatCreateAndAuthenticateValidUserWithValidCookie(): Promise<request.Response> {
  const user = await UserService.registerUser(uniqueEmail(), PASSWORD);

  const challenge = await Challenge.findOne({
    where: { userId: user.id, type: 'email' },
  });

  if (!challenge) {
    throw new Error('Challenge not found');
  }

  await UserService.verifyEmail(user, challenge.token);

  const loginResponse = await request(app).post('/session').send({
    email: user.email,
    password: PASSWORD,
  });

  expect(loginResponse.status).to.equal(StatusCodes.OK);

  // Verif si le cookie est bien créé
  const cookie = loginResponse.headers['set-cookie'];
  expect(cookie).to.not.be.empty;

  expect(cookie[0]).to.include('accessToken');
  const accessToken: string = cookie[0];

  expect(accessToken).to.include('HttpOnly');
  expect(accessToken).to.include('SameSite=Strict');

  return loginResponse;
}

describe('SessionRouter', () => {
  describe('POST /session', () => {
    it('should return a 401 status code if user does not exist', async () => {
      const response = await request(app).post('/session').send({
        email: 'email',
        password: 'impossible',
      });

      expect(response.status).to.equal(StatusCodes.UNAUTHORIZED);
    });

    it('should return a 401 status code if email is unverified', async () => {
      const user = await UserService.registerUser(uniqueEmail(), PASSWORD);

      const response = await request(app).post('/session').send({
        email: user.email,
        password: PASSWORD,
      });

      expect(response.status).to.equal(StatusCodes.UNAUTHORIZED);
    });

    it(
      'should set a cookie if email is verified',
      testThatCreateAndAuthenticateValidUserWithValidCookie,
    );
  });

  describe('GET /session', () => {
    it('should return a 401 status code if user is not authenticated', async () => {
      const response = await request(app).get('/session');

      expect(response.status).to.equal(StatusCodes.UNAUTHORIZED);
    });

    it('should return a 200 status code if user is authenticated', async () => {
      const loginResponse =
        await testThatCreateAndAuthenticateValidUserWithValidCookie();

      const cookie = loginResponse.headers['set-cookie'];
      const response = await request(app).get('/session').set('Cookie', cookie);

      expect(response.status).to.equal(StatusCodes.OK);
    });
  });

  describe('GET /session/logout', () => {
    it('should return a 401 status code if user is not authenticated', async () => {
      const response = await request(app).get('/session/logout');

      expect(response.status).to.equal(StatusCodes.UNAUTHORIZED);
    });

    it('should return a 200 status code if user is authenticated and remove the cookie', async () => {
      const loginResponse =
        await testThatCreateAndAuthenticateValidUserWithValidCookie();

      const cookie = loginResponse.headers['set-cookie'];
      const response = await request(app)
        .get('/session/logout')
        .set('Cookie', cookie);

      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.headers['set-cookie'][0]).to.include('accessToken=;'); // Cookie empty
    });
  });
});

import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import app from '../../app/index';
import { Challenge } from '../../app/models/sql/Challenge';
import { User } from '../../app/models/sql/User';
import { UserService } from '../../app/services/UserService';
import { uniqueEmail } from './helpers';

describe('SessionRouter', () => {
  describe('POST /session', () => {
    const PASSWORD = 'DarkraiIsBest123%';

    const registerUser = async (): Promise<User> => {
      return await UserService.registerUser(uniqueEmail(), PASSWORD);
    };

    it('should return a 401 status code if user does not exist', async () => {
      const response = await request(app).post('/session').send({
        email: 'email',
        password: 'impossible',
      });

      expect(response.status).to.equal(StatusCodes.UNAUTHORIZED);
    });

    it('should return a 401 status code if email is unverified', async () => {
      const user = await registerUser();

      const response = await request(app).post('/session').send({
        email: user.email,
        password: PASSWORD,
      });

      expect(response.status).to.equal(StatusCodes.UNAUTHORIZED);
    });

    it('should set a cookie if email is verified', async () => {
      const user = await registerUser();

      const challenge = await Challenge.findOne({
        where: { userId: user.id, type: 'email' },
      });

      if (!challenge) {
        throw new Error('Challenge not found');
      }

      await UserService.verifyEmail(user, challenge.token);

      const response = await request(app).post('/session').send({
        email: user.email,
        password: PASSWORD,
      });

      expect(response.status).to.equal(StatusCodes.NO_CONTENT);

      // Verif si le cookie est bien créé
      const cookie = response.headers['set-cookie'];
      expect(cookie).to.not.be.empty;

      expect(cookie[0]).to.include('accessToken');
      const accessToken: string = cookie[0];

      expect(accessToken).to.include('HttpOnly');
      expect(accessToken).to.include('SameSite=Strict');
    });
  });
});

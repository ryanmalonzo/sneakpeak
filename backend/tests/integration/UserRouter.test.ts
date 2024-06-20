import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import app from '../../app/index';
import { Challenge } from '../../app/models/sql/Challenge';
import { User } from '../../app/models/sql/User';
import { UserService } from '../../app/services/UserService';
import { uniqueEmail } from './helpers';

describe('UserRouter', () => {
  const PASSWORD = 'KaijuHachigou123%';

  describe('POST /users', () => {
    it('should return a 201 status code if user is created', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          email: `test-${Date.now()}@sneakpeak.store`,
          password: PASSWORD,
        });

      expect(response.status).to.equal(StatusCodes.CREATED);
    });

    it('should return a 401 status code if email is already in use', async () => {
      const email = uniqueEmail();

      await UserService.registerUser(email, PASSWORD);

      const response = await request(app).post('/users').send({
        email,
        password: PASSWORD,
      });

      expect(response.status).to.equal(StatusCodes.UNAUTHORIZED);
    });

    it('should return a 422 status code if email is invalid', async () => {
      const response = await request(app).post('/users').send({
        email: 'invalid-email',
        password: PASSWORD,
      });

      expect(response.status).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
    });

    it('should return a 422 status code if password is invalid', async () => {
      const response = await request(app).post('/users').send({
        email: uniqueEmail(),
        password: 'invalid-password',
      });

      expect(response.status).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
    });
  });

  describe('POST /users/:id/challenge/email', () => {
    const registerUser = async (): Promise<User> => {
      return await UserService.registerUser(uniqueEmail(), PASSWORD);
    };

    it('should return a 404 status code if user is not found', async () => {
      const response = await request(app)
        .post('/users/0/challenge/email')
        .send({
          token: 'token',
        });

      expect(response.status).to.equal(StatusCodes.NOT_FOUND);
    });

    it('should return a 200 status code if email is verified', async () => {
      const user = await registerUser();

      const challenge = await Challenge.findOne({
        where: {
          userId: user.id,
          type: 'email',
        },
      });

      const response = await request(app)
        .post(`/users/${user.id}/challenge/email`)
        .send({
          token: challenge?.token,
        });

      expect(response.status).to.equal(StatusCodes.OK);
    });

    it('should return a 401 status code if token is invalid', async () => {
      const user = await registerUser();

      const response = await request(app)
        .post(`/users/${user.id}/challenge/email`)
        .send({
          token: 'token',
        });

      expect(response.status).to.equal(StatusCodes.UNAUTHORIZED);
    });

    it('should return a 401 status code if token is expired', async () => {
      const user = await registerUser();

      const challenge = await Challenge.findOne({
        where: {
          userId: user.id,
          type: 'email',
          disabled: false,
        },
      });

      if (challenge) {
        // In the past
        challenge.expiresAt = new Date(new Date().getTime() - 1000);
        await challenge.save();
      }

      const response = await request(app)
        .post(`/users/${user.id}/challenge/email`)
        .send({
          token: challenge?.token,
        });

      expect(response.status).to.equal(StatusCodes.UNAUTHORIZED);
    });

    it('should return a 409 status code if email is already verified', async () => {
      const user = await registerUser();

      const challenge = await Challenge.findOne({
        where: {
          userId: user.id,
          type: 'email',
        },
      });

      if (challenge) {
        challenge.disabled = true;
        await challenge.save();
      }

      const response = await request(app)
        .post(`/users/${user.id}/challenge/email`)
        .send({
          token: challenge?.token,
        });

      expect(response.status).to.equal(StatusCodes.CONFLICT);
    });
  });

  describe('POST /users/password-reset', () => {
    it('should return a 200 status code if email is sent', async () => {
      const user = await UserService.registerUser(uniqueEmail(), PASSWORD);

      const response = await request(app).post('/users/password-reset').send({
        email: user.email,
      });

      expect(response.status).to.equal(StatusCodes.OK);
    });

    it('should return a 422 status code if email is invalid', async () => {
      const response = await request(app).post('/users/password-reset').send({
        email: 'invalid-email',
      });

      expect(response.status).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
    });

    it('should return a 200 satus code even if user is not found', async () => {
      const response = await request(app).post('/users/password-reset').send({
        email: uniqueEmail(),
      });

      expect(response.status).to.equal(StatusCodes.OK);
    });
  });

  describe('PUT /users/:id/password', () => {
    const registerUser = async (): Promise<User> => {
      return await UserService.registerUser(uniqueEmail(), PASSWORD);
    };

    it('should return a 404 status code if user is not found', async () => {
      const response = await request(app).put('/users/0/password').send({
        token: 'token',
        password: PASSWORD,
      });

      expect(response.status).to.equal(StatusCodes.NOT_FOUND);
    });

    it('should return a 200 status code if password is reset', async () => {
      const user = await registerUser();
      await UserService.sendPasswordResetEmail(user.email);

      const challenge = await Challenge.findOne({
        where: {
          userId: user.id,
          type: 'password-reset',
        },
      });

      const response = await request(app)
        .put(`/users/${user.id}/password`)
        .send({
          token: challenge?.token,
          password: PASSWORD,
        });

      expect(response.status).to.equal(StatusCodes.OK);
    });

    it('should return a 401 status code if token is invalid', async () => {
      const user = await registerUser();
      await UserService.sendPasswordResetEmail(user.email);

      const response = await request(app)
        .put(`/users/${user.id}/password`)
        .send({
          token: 'token',
          password: PASSWORD,
        });

      expect(response.status).to.equal(StatusCodes.UNAUTHORIZED);
    });

    it('should return a 401 status code if token is expired', async () => {
      const user = await registerUser();

      const challenge = await Challenge.create({
        userId: user.id,
        type: 'password-reset',
        token: 'token',
        expiresAt: new Date(new Date().getTime() - 1000),
      });

      const response = await request(app)
        .put(`/users/${user.id}/password`)
        .send({
          token: challenge.token,
          password: PASSWORD,
        });

      expect(response.status).to.equal(StatusCodes.UNAUTHORIZED);
    });
  });
});

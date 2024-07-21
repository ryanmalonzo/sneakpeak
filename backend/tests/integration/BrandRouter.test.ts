import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../../app';
import { UserService } from '../../app/services/UserService';
import { uniqueEmail } from './helpers';
import { Brand } from '../../app/models/sql/Brand';
import { ChallengeRepository } from '../../app/repositories/sql/ChallengeRepository';

describe('BrandRouter', () => {
  let email: string;
  let userId: number;
  let accessToken: string;
  let brand: Brand;

  before(async () => {
    email = uniqueEmail();

    await UserService.registerUser(email, 'Sneakpeak12345*$');
    const user = await UserService.findByEmail(email);

    const challenge = await ChallengeRepository.findByUserAndType(
      user!,
      'email',
    );

    await UserService.verifyEmail(user!, challenge!.token);

    userId = user!.id;

    await UserService.update(userId, { roles: ['USER', 'ADMIN'] });

    accessToken = jwt.sign({ userId }, process.env.JWT_SECRET as string);
  });

  describe('GET /brands', () => {
    it('should return a 200 status code', async () => {
      const response = await request(app)
        .get('/brands')
        .set('Cookie', `accessToken=${accessToken}`);

      expect(response.status).to.equal(StatusCodes.OK);
    });
  });

  describe('POST /brands', () => {
    it('should return a 201 status code if brand is created', async () => {
      const response = await request(app)
        .post('/brands')
        .set('Cookie', `accessToken=${accessToken}`)
        .send({
          name: 'Nike',
          image: 'https://example.com/nike.png',
        });

      expect(response.status).to.equal(StatusCodes.CREATED);
    });
  });

  describe('PUT /brands/:id', () => {
    it('should return a 201 status code if brand is created', async () => {
      const response = await request(app)
        .put('/brands/999')
        .set('Cookie', `accessToken=${accessToken}`)
        .send({
          name: 'Nike',
          image: 'https://example.com/nike.png',
        });

      expect(response.status).to.equal(StatusCodes.CREATED);
      brand = response.body;
    });
  });

  describe('PUT /brands/:id', () => {
    it('should return a 200 status code if brand is updated', async () => {
      const response = await request(app)
        .put('/brands/' + brand.id)
        .set('Cookie', `accessToken=${accessToken}`)
        .send({
          name: 'Nike',
          image: 'https://example.com/nike.png',
        });

      expect(response.status).to.equal(StatusCodes.OK);
    });
  });

  describe('DELETE /brands/:id', () => {
    it('should return a 200 status code if brand is deleted', async () => {
      const response = await request(app)
        .delete('/brands/' + brand.id)
        .set('Cookie', `accessToken=${accessToken}`);

      expect(response.status).to.equal(StatusCodes.OK);
    });
  });
});

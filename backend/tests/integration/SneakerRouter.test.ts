import { expect } from 'chai';
import app from '../../app';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';

function expectSneaker(sneaker: object) {
  expect(sneaker).to.have.property('id');
  expect(sneaker).to.have.property('name');
  expect(sneaker).to.have.property('description');
  expect(sneaker).to.have.property('price');
  expect(sneaker).to.have.property('categoryId');
  expect(sneaker).to.have.property('brandId');
}

describe('SneakerRouter', () => {
  describe('GET /sneakers', () => {
    it('should return a 200 status code and a list of sneakers', async () => {
      const response = await request(app).get('/sneakers');

      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.body.items).to.be.an('array');
    });
  });

  describe('GET /sneakers/:id', () => {
    it('should return a 200 status code and a sneaker', async () => {
      const response = await request(app).get('/sneakers/1');

      expect(response.status).to.equal(StatusCodes.OK);
    });

    it('should return a 404 status code if sneaker does not exist', async () => {
      const response = await request(app).get('/sneakers/99999999');

      expect(response.status).to.equal(StatusCodes.NOT_FOUND);
    });
  });

  describe('POST /sneakers', () => {
    const sneaker = {
      name: 'AF1',
      description: 'desc',
      price: 10.99,
      categoryId: 1,
      brandId: 1,
    };
    it('should return a 201 status code and the created sneaker', async () => {
      const response = await request(app).post('/sneakers').send(sneaker);

      expect(response.status).to.equal(StatusCodes.CREATED);
      expectSneaker(response.body);
    });

    it('should return a 422 status code if sneaker already exists', async () => {
      const response = await request(app).post('/sneakers').send(sneaker);

      expect(response.status).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
    });

    it('should return a 422 status code if a field is missing', async () => {
      const response = await request(app).post('/sneakers').send({
        // missing name, etc...
        description: 'description',
      });

      expect(response.status).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
    });
  });

  describe('PUT /sneakers/:id', () => {
    it('should return a 200 status code and the updated sneaker', async () => {
      const response = await request(app).put('/sneakers/1').send({
        name: 'AF1',
        description: 'desc',
        price: 10.99,
        categoryId: 1,
        brandId: 1,
      });

      expect(response.status).to.equal(StatusCodes.OK);
      expectSneaker(response.body);
    });

    it('should return a 201 status code if sneaker does not exist and the created sneaker', async () => {
      const response = await request(app).put('/sneakers/88888').send({
        name: 'AF1',
        description: 'desc',
        price: 10.99,
        categoryId: 1,
        brandId: 1,
      });
      expect(response.status).to.equal(StatusCodes.CREATED);
    });
  });

  describe('PATCH /sneakers/:id', () => {
    it('should return a 200 status code and the updated sneaker', async () => {
      const response = await request(app).patch('/sneakers/88888').send({
        name: 'AF1',
        description: 'descUpdated',
        price: 10.99,
        categoryId: 1,
        brandId: 1,
      });

      expect(response.status).to.equal(StatusCodes.OK);
      expectSneaker(response.body);
    });

    it('should return a 404 status code if sneaker does not exist', async () => {
      const response = await request(app).patch('/sneakers/99999999').send({
        name: 'AF1',
        description: 'desc',
        price: 10.99,
        categoryId: 1,
        brandId: 1,
      });

      expect(response.status).to.equal(StatusCodes.NOT_FOUND);
    });
  });

  describe('DELETE /sneakers/:id', () => {
    it('should return a 204 status code', async () => {
      const response = await request(app).delete('/sneakers/1');

      expect(response.status).to.equal(StatusCodes.NO_CONTENT);
    });

    it('should return a 404 status code if sneaker does not exist', async () => {
      const response = await request(app).delete('/sneakers/999999');

      expect(response.status).to.equal(StatusCodes.NOT_FOUND);
    });
  });
});

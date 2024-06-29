import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import app from '../../app/index';
import { before } from 'mocha';
import { UserService } from '../../app/services/UserService';
import { Challenge } from '../../app/models/sql/Challenge';
import { Category } from '../../app/models/sql/Category';
import { Brand } from '../../app/models/sql/Brand';
import { Sneaker } from '../../app/models/sql/Sneaker';
import { faker } from '@faker-js/faker';
import { imageUrlToBase64 } from '../../app/helpers/images';
import { VariantRepository } from '../../app/repositories/sql/VariantRepository';
import { Color } from '../../app/models/sql/Color';
import { Size } from '../../app/models/sql/Size';

let token = '';
const noToken = '';
const PASSWORD = 'DarkraiIsBest123%';

before(async () => {
  const user = await UserService.registerUser('unique@gmail.com', PASSWORD);

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

  const cookie = loginResponse.headers['set-cookie'];
  if (!cookie) {
    throw new Error('Login failed, no cookie found');
  }

  token = cookie[0].split(';')[0]; // Prendre seulement le cookie sans les options supplémentaires

  for (let i = 0; i < 3; i++) {
    const category = await Category.create({
      name: faker.lorem.word(),
      slug: faker.lorem.slug(),
      image: await imageUrlToBase64(
        faker.image.urlLoremFlickr({ category: 'sneaker' }),
      ),
    });
    const brand = await Brand.create({
      name: faker.company.name(),
      slug: faker.lorem.slug(),
      image: await imageUrlToBase64(
        faker.image.urlLoremFlickr({ category: 'logo' }),
      ),
    });
    const sneaker = await Sneaker.create({
      name: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      price: faker.number.float({ min: 50, max: 300, multipleOf: 0.1 }),
      categoryId: category.id,
      brandId: brand.id,
    });

    const color = Color.build({
      name: faker.internet.color(),
      slug: faker.lorem.slug(),
      hex: faker.internet.color(),
    });

    await color.save();

    const size = Size.build({
      name: '42',
      slug: '42',
    });

    await size.save();

    const variant = VariantRepository.build({
      sneakerId: sneaker.id,
      image: await imageUrlToBase64(faker.image.urlLoremFlickr()),
      sizeId: size.id,
      colorId: color.id,
      stock: 5,
    });

    await VariantRepository.save(variant);
  }
});

async function testThatInsertProductInCart(): Promise<request.Response> {
  const response = await request(app)
    .post('/cart')
    .set('Cookie', [token])
    .send({
      variantId: 1,
      quantity: 1,
    });

  expect(response.status).to.equal(StatusCodes.CREATED);

  return response;
}

async function testThatGetCart(): Promise<request.Response> {
  const response = await request(app).get('/cart').set('Cookie', [token]);

  expect(response.status).to.equal(StatusCodes.OK);

  return response;
}

async function testThatUpdateProductInCart(): Promise<request.Response> {
  const response = await request(app).put('/cart').set('Cookie', [token]).send({
    userId: 1,
    variantId: 1,
    quantity: 2,
  });

  expect(response.status).to.equal(StatusCodes.OK);

  return response;
}

async function testThatDeleteProductInCart(): Promise<request.Response> {
  const response = await request(app)
    .delete('/cart/1')
    .set('Cookie', [token])
    .send({
      userId: 1,
    });

  expect(response.status).to.equal(StatusCodes.OK);

  return response;
}

async function testThatCantInsertProductInCartWithoutUserId(): Promise<void> {
  const response = await request(app)
    .post('/cart')
    .set('Cookie', [noToken])
    .send({
      variantId: 1,
      quantity: 1,
    });

  expect(response.status).to.equal(StatusCodes.UNAUTHORIZED);
}

async function testThatCantInsertProductInCartWithoutProductId(): Promise<void> {
  const response = await request(app)
    .post('/cart')
    .set('Cookie', [token])
    .send({
      quantity: 1,
    });

  expect(response.status).to.equal(StatusCodes.NOT_FOUND);
}

async function testThatCantInsertProductInCartWithoutQuantity(): Promise<void> {
  const response = await request(app)
    .post('/cart')
    .set('Cookie', [token])
    .send({
      variantId: 1,
    });

  expect(response.status).to.equal(StatusCodes.BAD_REQUEST);
}

async function testThatCantUpdateProductInCartWithoutUserId(): Promise<void> {
  const response = await request(app)
    .put('/cart')
    .set('Cookie', [noToken])
    .send({
      variantId: 1,
      quantity: 2,
    });

  expect(response.status).to.equal(StatusCodes.UNAUTHORIZED);
}

async function testThatCantUpdateProductInCartWithoutProductId(): Promise<void> {
  const response = await request(app).put('/cart').set('Cookie', [token]).send({
    quantity: 2,
  });

  expect(response.status).to.equal(StatusCodes.NOT_FOUND);
}

async function testThatCantUpdateProductInCartWithoutQuantity(): Promise<void> {
  const response = await request(app).put('/cart').set('Cookie', [token]).send({
    variantId: 1,
  });

  expect(response.status).to.equal(StatusCodes.BAD_REQUEST);
}

async function testThatCantDeleteProductInCartWithoutUserId(): Promise<void> {
  const response = await request(app)
    .delete('/cart/1')
    .set('Cookie', [noToken]);

  expect(response.status).to.equal(StatusCodes.UNAUTHORIZED);
}

async function testThatCantDeleteProductInCartWithoutProductId(): Promise<void> {
  const response = await request(app).delete('/cart').set('Cookie', [token]);

  expect(response.status).to.equal(StatusCodes.NOT_FOUND);
}

async function testThatCantInsertProductInCartWithInvalidUserId(): Promise<void> {
  const response = await request(app)
    .post('/cart')
    .set('Cookie', [noToken])
    .send({
      variantId: 1,
      quantity: 1,
    });

  expect(response.status).to.equal(StatusCodes.UNAUTHORIZED);
}

async function testThatCantInsertProductInCartWithInvalidProductId(): Promise<void> {
  const response = await request(app)
    .post('/cart')
    .set('Cookie', [token])
    .send({
      variantId: 999,
      quantity: 1,
    });

  expect(response.status).to.equal(StatusCodes.NOT_FOUND);
}

async function testThatCantUpdateProductInCartWithInvalidUserId(): Promise<void> {
  const response = await request(app)
    .put('/cart')
    .set('Cookie', [noToken])
    .send({
      variantId: 1,
      quantity: 2,
    });

  expect(response.status).to.equal(StatusCodes.UNAUTHORIZED);
}

async function testThatCantUpdateProductInCartWithInvalidProductId(): Promise<void> {
  const response = await request(app).put('/cart').set('Cookie', [token]).send({
    variantId: 999,
    quantity: 2,
  });

  expect(response.status).to.equal(StatusCodes.NOT_FOUND);
}

async function testThatCantDeleteProductInCartWithInvalidUserId(): Promise<void> {
  const response = await request(app)
    .delete('/cart/1')
    .set('Cookie', [noToken]);

  expect(response.status).to.equal(StatusCodes.UNAUTHORIZED);
}

async function testThatCantDeleteProductInCartWithInvalidProductId(): Promise<void> {
  const response = await request(app)
    .delete('/cart/999')
    .set('Cookie', [token]);

  expect(response.status).to.equal(StatusCodes.NOT_FOUND);
}

describe('CartRouter', () => {
  describe('POST /cart', () => {
    it('should insert a product in the cart', async () => {
      await testThatInsertProductInCart();
    });
  });
  describe('GET /cart', () => {
    it('should return the cart', async () => {
      await testThatGetCart();
    });
  });

  describe('PUT /cart', () => {
    it('should update a product in the cart', async () => {
      await testThatUpdateProductInCart();
    });
  });

  describe('DELETE /cart', () => {
    it('should delete a product in the cart', async () => {
      await testThatDeleteProductInCart();
    });
  });

  describe('POST /cart', () => {
    it('should return a 400 status code when trying to insert a product in the cart without userId', async () => {
      await testThatCantInsertProductInCartWithoutUserId();
    });
  });

  describe('POST /cart', () => {
    it('should return a 400 status code when trying to insert a product in the cart without variantId', async () => {
      await testThatCantInsertProductInCartWithoutProductId();
    });
  });

  describe('POST /cart', () => {
    it('should return a 400 status code when trying to insert a product in the cart without quantity', async () => {
      await testThatCantInsertProductInCartWithoutQuantity();
    });
  });

  describe('PUT /cart', () => {
    it('should return a 400 status code when trying to update a product in the cart without userId', async () => {
      await testThatCantUpdateProductInCartWithoutUserId();
    });
  });

  describe('PUT /cart', () => {
    it('should return a 400 status code when trying to update a product in the cart without variantId', async () => {
      await testThatCantUpdateProductInCartWithoutProductId();
    });
  });

  describe('PUT /cart', () => {
    it('should return a 400 status code when trying to update a product in the cart without quantity', async () => {
      await testThatCantUpdateProductInCartWithoutQuantity();
    });
  });

  describe('DELETE /cart', () => {
    it('should return a 400 status code when trying to delete a product in the cart without userId', async () => {
      await testThatCantDeleteProductInCartWithoutUserId();
    });
  });

  describe('DELETE /cart', () => {
    it('should return a 400 status code when trying to delete a product in the cart without variantId', async () => {
      await testThatCantDeleteProductInCartWithoutProductId();
    });
  });

  describe('POST /cart', () => {
    it('should return a 404 status code when trying to insert a product in the cart with invalid userId', async () => {
      await testThatCantInsertProductInCartWithInvalidUserId();
    });
  });

  describe('POST /cart', () => {
    it('should return a 404 status code when trying to insert a product in the cart with invalid variantId', async () => {
      await testThatCantInsertProductInCartWithInvalidProductId();
    });
  });

  describe('PUT /cart', () => {
    it('should return a 404 status code when trying to update a product in the cart with invalid userId', async () => {
      await testThatCantUpdateProductInCartWithInvalidUserId();
    });
  });

  describe('PUT /cart', () => {
    it('should return a 404 status code when trying to update a product in the cart with invalid variantId', async () => {
      await testThatCantUpdateProductInCartWithInvalidProductId();
    });
  });

  describe('DELETE /cart', () => {
    it('should return a 404 status code when trying to delete a product in the cart with invalid userId', async () => {
      await testThatCantDeleteProductInCartWithInvalidUserId();
    });
  });

  describe('DELETE /cart', () => {
    it('should return a 404 status code when trying to delete a product in the cart with invalid variantId', async () => {
      await testThatCantDeleteProductInCartWithInvalidProductId();
    });
  });
});

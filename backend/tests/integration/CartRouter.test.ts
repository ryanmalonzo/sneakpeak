import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import app from '../../app/index';

async function testThatInsertProductInCart(): Promise<request.Response> {
  const response = await request(app).post('/cart').send({
    variantId: 1,
    quantity: 1,
  });

  expect(response.status).to.equal(StatusCodes.CREATED);

  return response;
}

// async function testThatGetCart(): Promise<request.Response> {
//   const response = await request(app).get('/cart');

//   expect(response.status).to.equal(StatusCodes.OK);

//   return response;
// }

// async function testThatUpdateProductInCart(): Promise<request.Response> {
//   const response = await request(app).put('/cart').send({
//     userId: 1,
//     productId: 1,
//     quantity: 2,
//   });

//   expect(response.status).to.equal(StatusCodes.OK);

//   return response;
// }

// async function testThatDeleteProductInCart(): Promise<request.Response> {
//   const response = await request(app).delete('/cart/1').send({
//     userId: 1,
//   });

//   expect(response.status).to.equal(StatusCodes.OK);

//   return response;
// }

// async function testThatCantInsertProductInCartWithoutUserId(): Promise<void> {
//   const response = await request(app).post('/cart').send({
//     productId: 1,
//     quantity: 1,
//   });

//   expect(response.status).to.equal(StatusCodes.BAD_REQUEST);
// }

// async function testThatCantInsertProductInCartWithoutProductId(): Promise<void> {
//   const response = await request(app).post('/cart').send({
//     userId: 1,
//     quantity: 1,
//   });

//   expect(response.status).to.equal(StatusCodes.BAD_REQUEST);
// }

// async function testThatCantInsertProductInCartWithoutQuantity(): Promise<void> {
//   const response = await request(app).post('/cart').send({
//     userId: 1,
//     productId: 1,
//   });

//   expect(response.status).to.equal(StatusCodes.BAD_REQUEST);
// }

// async function testThatCantUpdateProductInCartWithoutUserId(): Promise<void> {
//   const response = await request(app).put('/cart').send({
//     productId: 1,
//     quantity: 2,
//   });

//   expect(response.status).to.equal(StatusCodes.BAD_REQUEST);
// }

// async function testThatCantUpdateProductInCartWithoutProductId(): Promise<void> {
//   const response = await request(app).put('/cart').send({
//     userId: 1,
//     quantity: 2,
//   });

//   expect(response.status).to.equal(StatusCodes.BAD_REQUEST);
// }

// async function testThatCantUpdateProductInCartWithoutQuantity(): Promise<void> {
//   const response = await request(app).put('/cart').send({
//     userId: 1,
//     productId: 1,
//   });

//   expect(response.status).to.equal(StatusCodes.BAD_REQUEST);
// }

// async function testThatCantDeleteProductInCartWithoutUserId(): Promise<void> {
//   const response = await request(app).delete('/cart/1');

//   expect(response.status).to.equal(StatusCodes.BAD_REQUEST);
// }

// async function testThatCantDeleteProductInCartWithoutProductId(): Promise<void> {
//   const response = await request(app).delete('/cart/1');

//   expect(response.status).to.equal(StatusCodes.BAD_REQUEST);
// }

// async function testThatCantInsertProductInCartWithInvalidUserId(): Promise<void> {
//   const response = await request(app).post('/cart').send({
//     userId: 999,
//     productId: 1,
//     quantity: 1,
//   });

//   expect(response.status).to.equal(StatusCodes.NOT_FOUND);
// }

// async function testThatCantInsertProductInCartWithInvalidProductId(): Promise<void> {
//   const response = await request(app).post('/cart').send({
//     userId: 1,
//     productId: 999,
//     quantity: 1,
//   });

//   expect(response.status).to.equal(StatusCodes.NOT_FOUND);
// }

// async function testThatCantUpdateProductInCartWithInvalidUserId(): Promise<void> {
//   const response = await request(app).put('/cart').send({
//     userId: 999,
//     productId: 1,
//     quantity: 2,
//   });

//   expect(response.status).to.equal(StatusCodes.NOT_FOUND);
// }

// async function testThatCantUpdateProductInCartWithInvalidProductId(): Promise<void> {
//   const response = await request(app).put('/cart').send({
//     userId: 1,
//     productId: 999,
//     quantity: 2,
//   });

//   expect(response.status).to.equal(StatusCodes.NOT_FOUND);
// }

// async function testThatCantDeleteProductInCartWithInvalidUserId(): Promise<void> {
//   const response = await request(app).delete('/cart/1');

//   expect(response.status).to.equal(StatusCodes.NOT_FOUND);
// }

// async function testThatCantDeleteProductInCartWithInvalidProductId(): Promise<void> {
//   const response = await request(app).delete('/cart/999');

//   expect(response.status).to.equal(StatusCodes.NOT_FOUND);
// }

describe('CartRouter', () => {
  describe('POST /cart', () => {
    it('should insert a product in the cart', async () => {
      await testThatInsertProductInCart();
    });
  });
});

//   describe('GET /cart', () => {
//     it('should return the cart', async () => {
//       await testThatGetCart();
//     });
//   });

//   describe('PUT /cart', () => {
//     it('should update a product in the cart', async () => {
//       await testThatUpdateProductInCart();
//     });
//   });

//   describe('DELETE /cart', () => {
//     it('should delete a product in the cart', async () => {
//       await testThatDeleteProductInCart();
//     });
//   });

//   describe('POST /cart', () => {
//     it('should return a 400 status code when trying to insert a product in the cart without userId', async () => {
//       await testThatCantInsertProductInCartWithoutUserId();
//     });
//   });

//   describe('POST /cart', () => {
//     it('should return a 400 status code when trying to insert a product in the cart without productId', async () => {
//       await testThatCantInsertProductInCartWithoutProductId();
//     });
//   });

//   describe('POST /cart', () => {
//     it('should return a 400 status code when trying to insert a product in the cart without quantity', async () => {
//       await testThatCantInsertProductInCartWithoutQuantity();
//     });
//   });

//   describe('PUT /cart', () => {
//     it('should return a 400 status code when trying to update a product in the cart without userId', async () => {
//       await testThatCantUpdateProductInCartWithoutUserId();
//     });
//   });

//   describe('PUT /cart', () => {
//     it('should return a 400 status code when trying to update a product in the cart without productId', async () => {
//       await testThatCantUpdateProductInCartWithoutProductId();
//     });
//   });

//   describe('PUT /cart', () => {
//     it('should return a 400 status code when trying to update a product in the cart without quantity', async () => {
//       await testThatCantUpdateProductInCartWithoutQuantity();
//     });
//   });

//   describe('DELETE /cart', () => {
//     it('should return a 400 status code when trying to delete a product in the cart without userId', async () => {
//       await testThatCantDeleteProductInCartWithoutUserId();
//     });
//   });

//   describe('DELETE /cart', () => {
//     it('should return a 400 status code when trying to delete a product in the cart without productId', async () => {
//       await testThatCantDeleteProductInCartWithoutProductId();
//     });
//   });

//   describe('POST /cart', () => {
//     it('should return a 404 status code when trying to insert a product in the cart with invalid userId', async () => {
//       await testThatCantInsertProductInCartWithInvalidUserId();
//     });
//   });

//   describe('POST /cart', () => {
//     it('should return a 404 status code when trying to insert a product in the cart with invalid productId', async () => {
//       await testThatCantInsertProductInCartWithInvalidProductId();
//     });
//   });

//   describe('PUT /cart', () => {
//     it('should return a 404 status code when trying to update a product in the cart with invalid userId', async () => {
//       await testThatCantUpdateProductInCartWithInvalidUserId();
//     });
//   });

//   describe('PUT /cart', () => {
//     it('should return a 404 status code when trying to update a product in the cart with invalid productId', async () => {
//       await testThatCantUpdateProductInCartWithInvalidProductId();
//     });
//   });

//   describe('DELETE /cart', () => {
//     it('should return a 404 status code when trying to delete a product in the cart with invalid userId', async () => {
//       await testThatCantDeleteProductInCartWithInvalidUserId();
//     });
//   });

//   describe('DELETE /cart', () => {
//     it('should return a 404 status code when trying to delete a product in the cart with invalid productId', async () => {
//       await testThatCantDeleteProductInCartWithInvalidProductId();
//     });
//   });
// });

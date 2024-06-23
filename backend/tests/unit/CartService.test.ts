import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import { CartService } from '../../app/services/CartService';
import { UserRepository } from '../../app/repositories/sql/UserRepository';
import { VariantRepository } from '../../app/repositories/sql/VariantRepository';
import { User } from '../../app/models/sql/User';
import { uniqueEmail } from '../integration/helpers';

use(chaiAsPromised);

afterEach(() => {
  sinon.restore();
});

describe('CartService', () => {
  const USER = {
    email: uniqueEmail(),
    password: 'DarkraiIsBest123%',
  } as User;
  const VARIANT = {
    stock: 10,
    image: 'image',
    sneakerId: 1,
    sizeId: 1,
    colorId: 1,
  };
  describe('addProductToCart', () => {
    it('should throw an error when the variant is not found', async () => {
      const user = await expect(UserRepository.build(USER)).to.be.fulfilled;
      const variant = await expect(VariantRepository.build(VARIANT)).to.be
        .fulfilled;
      await expect(
        CartService.addProductToCart(user.id, variant.id, 1),
      ).to.be.rejectedWith('Variants not found');
    });

    it('should throw an error if the quantity is less than 1', async () => {
      await expect(CartService.addProductToCart(1, 1, 0)).to.be.rejectedWith(
        'Quantity must be positive',
      );
    });
  });
});

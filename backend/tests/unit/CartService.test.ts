import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import { CartService } from '../../app/services/CartService';
import { VariantRepository } from '../../app/repositories/sql/VariantRepository';
import { Variant } from '../../app/models/sql/Variant';
import { SneakerRepository } from '../../app/repositories/sql/SneakerRepository';
import { CartRepository } from '../../app/repositories/sql/CartRepository';
import { Cart } from '../../app/models/sql/Cart';
import { CartProductRepository } from '../../app/repositories/sql/CartProductRepository';
import { Sneaker } from '../../app/models/sql/Sneaker';
import { CartProduct } from '../../app/models/sql/CartProduct';

use(chaiAsPromised);

afterEach(() => {
  sinon.restore();
});

describe('CartService', () => {
  const CartProducts: CartProduct[] = [
    {
      cartId: 1,
      variantId: 1,
      quantity: 1,
      total: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as CartProduct,
  ];
  describe('addProductToCart', () => {
    const Variant: Variant = {
      id: 1,
      sneakerId: 1,
      sizeId: 42,
      colorId: 1,
      stock: 5,
    };
    it('should throw an error when the variant is not found', async () => {
      sinon.stub(CartRepository, 'getCartByUserId').resolves(null);
      sinon.stub(CartRepository, 'build').resolves({} as Cart);
      sinon.stub(CartRepository, 'createCart').resolves(undefined);
      sinon.stub(VariantRepository, 'findVariantById').resolves(null);
      await expect(CartService.addProductToCart(1, 1000, 1)).to.be.rejectedWith(
        'Variant not found',
      );
    });

    it('should throw an error when the sneaker is not found', async () => {
      sinon.stub(CartRepository, 'getCartByUserId').resolves(null);
      sinon.stub(CartRepository, 'build').resolves({} as Cart);
      sinon.stub(CartRepository, 'createCart').resolves(undefined);
      sinon.stub(VariantRepository, 'findVariantById').resolves({} as Variant);
      sinon.stub(SneakerRepository, 'findSneakerById').resolves(null);

      await expect(CartService.addProductToCart(1, 1, 1)).to.be.rejectedWith(
        'Sneaker not found',
      );
    });

    it('should throw an error if the quantity is less than 1', async () => {
      sinon.stub(CartRepository, 'getCartByUserId').resolves(null);
      sinon.stub(CartRepository, 'build').resolves({} as Cart);
      sinon.stub(CartRepository, 'createCart').resolves(undefined);

      await expect(CartService.addProductToCart(1, 1, 0)).to.be.rejectedWith(
        'Quantity must be positive',
      );
    });

    it('should throw an error if the stock is not enough', async () => {
      sinon.stub(CartRepository, 'getCartByUserId').resolves(null);
      sinon.stub(CartRepository, 'build').resolves({} as Cart);
      sinon.stub(CartRepository, 'createCart').resolves(undefined);
      sinon.stub(VariantRepository, 'findVariantById').resolves(Variant);
      sinon.stub(SneakerRepository, 'findSneakerById').resolves({} as Sneaker);
      sinon.stub(CartRepository, 'getCartProducts').resolves(CartProducts);

      await expect(CartService.addProductToCart(1, 1, 6)).to.be.rejectedWith(
        'Not enough stock',
      );
    });

    it('should throw an error if quantity is more than stock', async () => {
      const CartProducts: CartProduct[] = [
        {
          cartId: 1,
          variantId: 1,
          quantity: 0,
          total: 200,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as CartProduct,
      ];
      sinon.stub(CartRepository, 'getCartByUserId').resolves(null);
      sinon.stub(CartRepository, 'build').resolves({} as Cart);
      sinon.stub(CartRepository, 'createCart').resolves(undefined);
      sinon.stub(VariantRepository, 'findVariantById').resolves(Variant);
      sinon.stub(SneakerRepository, 'findSneakerById').resolves({} as Sneaker);
      sinon.stub(CartRepository, 'getCartProducts').resolves(CartProducts);

      await expect(CartService.addProductToCart(1, 1, 6)).to.be.rejectedWith(
        'Not enough stock',
      );
    });

    it('should add a product to the cart', async () => {
      const CartProducts: CartProduct[] = [
        {
          cartId: 1,
          variantId: 1,
          quantity: 0,
          total: 200,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as CartProduct,
      ];
      sinon.stub(CartRepository, 'getCartByUserId').resolves(null);
      sinon.stub(CartRepository, 'build').resolves({} as Cart);
      sinon.stub(CartRepository, 'createCart').resolves(undefined);
      sinon.stub(VariantRepository, 'findVariantById').resolves(Variant);
      sinon.stub(SneakerRepository, 'findSneakerById').resolves({} as Sneaker);
      sinon.stub(CartRepository, 'getCartProducts').resolves(CartProducts);
      sinon.stub(CartProductRepository, 'build').resolves({} as CartProduct);
      sinon.stub(CartProductRepository, 'addCartProduct').resolves(undefined);
      sinon.stub(CartRepository, 'updateCart').resolves(undefined);

      await expect(CartService.addProductToCart(1, 1, 1)).to.be.fulfilled;
    });
  });

  describe('updateProductInCart', () => {
    it('should throw an error when the cart is not found', async () => {
      sinon.stub(CartRepository, 'getCartByUserId').resolves(null);
      await expect(CartService.updateProductInCart(1, 1, 1)).to.be.rejectedWith(
        'Cart not found',
      );
    });

    it('should throw an error if the quantity is less than 1', async () => {
      sinon.stub(CartRepository, 'getCartByUserId').resolves({} as Cart);
      sinon.stub(CartRepository, 'getCartProducts').resolves(CartProducts);
      await expect(CartService.updateProductInCart(1, 1, 0)).to.be.rejectedWith(
        'Quantity must be positive',
      );
    });

    it('should throw an error if the products is not found in the cart', async () => {
      sinon.stub(CartRepository, 'getCartByUserId').resolves({} as Cart);
      sinon.stub(CartRepository, 'getCartProducts').resolves([]);
      await expect(CartService.updateProductInCart(1, 1, 1)).to.be.rejectedWith(
        'Product not found',
      );
    });

    it('should throw an error if the variant is not found', async () => {
      sinon.stub(CartRepository, 'getCartByUserId').resolves({} as Cart);
      console.log(!CartProducts.length);
      sinon.stub(CartRepository, 'getCartProducts').resolves(CartProducts);
      sinon.stub(VariantRepository, 'findVariantById').resolves(null);
      await expect(CartService.updateProductInCart(1, 1, 1)).to.be.rejectedWith(
        'Variant not found',
      );
    });

    it('should throw an error if the sneaker is not found', async () => {
      sinon.stub(CartRepository, 'getCartByUserId').resolves({} as Cart);
      console.log(!CartProducts.length);
      sinon.stub(CartRepository, 'getCartProducts').resolves(CartProducts);
      sinon.stub(VariantRepository, 'findVariantById').resolves({} as Variant);
      await expect(CartService.updateProductInCart(1, 1, 1)).to.be.rejectedWith(
        'Sneaker not found',
      );
    });

    it('should throw an error if the stock is not enough', async () => {
      sinon.stub(CartRepository, 'getCartByUserId').resolves({} as Cart);
      console.log(!CartProducts.length);
      sinon.stub(CartRepository, 'getCartProducts').resolves(CartProducts);
      sinon.stub(VariantRepository, 'findVariantById').resolves({
        stock: 5,
      } as Variant);
      sinon.stub(SneakerRepository, 'findSneakerById').resolves({} as Sneaker);
      await expect(
        CartService.updateProductInCart(1, 1, 100),
      ).to.be.rejectedWith('Not enough stock');
    });
  });

  describe('deleteProductFromCart', () => {
    const CartProducts: CartProduct[] = [
      {
        cartId: 1,
        variantId: 1,
        quantity: 0,
        total: 200,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as CartProduct,
    ];
    it('should throw an error when the cart is not found', async () => {
      sinon.stub(CartRepository, 'getCartByUserId').resolves(null);
      await expect(CartService.deleteProductFromCart(1, 1)).to.be.rejectedWith(
        'Cart not found',
      );
    });

    it('should throw an error if the product is not found in the cart', async () => {
      sinon.stub(CartRepository, 'getCartByUserId').resolves({} as Cart);
      sinon.stub(CartRepository, 'getCartProducts').resolves(CartProducts);
      await expect(CartService.deleteProductFromCart(1, 2)).to.be.rejectedWith(
        'Product not found',
      );
    });
  });
});

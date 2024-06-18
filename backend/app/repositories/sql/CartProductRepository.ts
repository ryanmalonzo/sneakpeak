import { CartProduct } from '../../models/sql/CartProduct';

export class CartProductRepository {
  static build(data: Partial<CartProduct>): CartProduct {
    return CartProduct.build(data);
  }
  static async findCartProductsByCartId(
    cartId: number,
  ): Promise<CartProduct[]> {
    CartProduct.upsert;
    return await CartProduct.findAll({
      where: {
        cartId,
      },
    });
  }

  static async AddOrUpdateCartProduct(
    cartProduct: CartProduct,
  ): Promise<CartProduct> {
    return await cartProduct.save();
  }

  static async deleteCartProduct(cartProduct: CartProduct): Promise<void> {
    await cartProduct.destroy();
  }
}

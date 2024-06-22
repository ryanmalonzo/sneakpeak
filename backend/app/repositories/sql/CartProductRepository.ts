import { CartProduct } from '../../models/sql/CartProduct';

export class CartProductRepository {
  static build(data: Partial<CartProduct>): CartProduct {
    return CartProduct.build(data);
  }
  static async findCartProductsByCartId(
    cartId: number,
  ): Promise<CartProduct[]> {
    console.log('cartId', cartId);
    const cartProducts = await CartProduct.findAll({
      where: { cart_id: cartId },
    });
    console.log('cartProducts', cartProducts);
    return cartProducts;
  }

  static async addCartProduct(cartProduct: CartProduct): Promise<CartProduct> {
    return await cartProduct.save();
  }

  static async deleteCartProduct(cartProduct: CartProduct): Promise<void> {
    await cartProduct.destroy();
  }
}

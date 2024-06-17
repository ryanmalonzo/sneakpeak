import { CartProduct } from '../../models/sql/CartProduct';

export class CartProductRepository {
  static async findCartProductsByCartId(cartId: number) {
    return await CartProduct.findAll({ where: { cart_id: cartId } });
  }
}

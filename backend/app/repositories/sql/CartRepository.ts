import { Cart } from '../../models/sql/Cart';
import { CartProduct } from '../../models/sql/CartProduct';

export class CartRepository {
  static build(data: Partial<Cart>): Cart {
    return Cart.build(data);
  }

  static async createCart(cart: Cart): Promise<Cart> {
    return await cart.save();
  }

  static async getCartByUserId(userId: number): Promise<Cart | null> {
    const cart = await Cart.findOne({ where: { user_id: userId } });
    return cart;
  }

  static async updateCart(cart: Cart): Promise<Cart> {
    return await cart.save();
  }

  static async deleteCart(cart: Cart): Promise<void> {
    await cart.destroy();
  }
  static async getCartProducts(cart: Cart): Promise<CartProduct[]> {
    const products = await cart.getCartProducts();
    return products;
  }
}

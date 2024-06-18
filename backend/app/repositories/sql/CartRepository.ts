import { Cart } from '../../models/sql/Cart';
import { CartProduct } from '../../models/sql/CartProduct';

export class CartRepository {
  static build(data: Partial<Cart>): Cart {
    return Cart.build(data);
  }

  static async createCart(cart: Cart): Promise<Cart> {
    return await cart.save();
  }

  static async getCartById(id: number): Promise<Cart | null> {
    return await Cart.findByPk(id);
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

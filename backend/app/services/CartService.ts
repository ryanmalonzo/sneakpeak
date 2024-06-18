import { Cart } from '../models/sql/Cart';
import { CartRepository } from '../repositories/sql/CartRepository';

export class CartService {
  static async addProductToCart(
    cartId: number,
    variantId: number,
    quantity: number,
  ) {
    let cart = await CartRepository.getCartById(cartId);
    if (!cart) {
      cart = CartRepository.build({
        id: cartId,
        createdAt: new Date(),
        expiredAt: new Date(new Date().getMinutes() + 15),
      });
      await CartRepository.createCart(cart);
    }
    // return await CartRepository.addProductToCart(cart, variantId, quantity);
  }
}

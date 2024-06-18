import { CartRepository } from '../repositories/sql/CartRepository';
import { CartProductRepository } from '../repositories/sql/CartProductRepository';

export class CartService {
  static async addOrUpdateProductToCart(
    cartId: number,
    userId: number,
    variantId: number,
    quantity: number,
  ) {
    let cart = await CartRepository.getCartById(cartId);
    if (!cart) {
      cart = CartRepository.build({
        id: cartId,
        user_id: userId,
        createdAt: new Date(),
        expiredAt: new Date(new Date().getMinutes() + 15),
      });
      await CartRepository.createCart(cart);
    }

    const products = await CartRepository.getCartProducts(cart);

    products.forEach((product) => {
      if (product.variant_id === variantId) {
        product.quantity += quantity;
        product.total = product.quantity * product.total;
        product.updatedAt = new Date();
        CartProductRepository.AddOrUpdateCartProduct(product);
      } else {
        const newProduct = CartProductRepository.build({
          cart_id: cartId,
          variant_id: variantId,
          quantity: quantity,
          total: quantity,
          createdAt: new Date(),
        });
        CartProductRepository.AddOrUpdateCartProduct(newProduct);
      }
    });

    await CartRepository.updateCart(cart);
  }

  static async getCartProducts(cartId: number) {
    const cart = await CartRepository.getCartById(cartId);
    if (!cart) {
      return [];
    }
    return await CartRepository.getCartProducts(cart);
  }

  static async deleteCart(cartId: number) {
    const cart = await CartRepository.getCartById(cartId);
    if (!cart) {
      return;
    }
    await CartRepository.deleteCart(cart);
  }

  static async deleteProductFromCart(cartId: number, variantId: number) {
    const cart = await CartRepository.getCartById(cartId);
    if (!cart) {
      return;
    }

    const products = await CartRepository.getCartProducts(cart);
    products.forEach((product) => {
      if (product.variant_id === variantId) {
        CartProductRepository.deleteCartProduct(product);
      }
    });
  }
}

import { CartRepository } from '../repositories/sql/CartRepository';
import { CartProductRepository } from '../repositories/sql/CartProductRepository';
import { VariantRepository } from '../repositories/sql/VariantRepository';
import { SneakerRepository } from '../repositories/sql/SneakerRepository';

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
        user_id: userId,
        createdAt: new Date(),
        expiredAt: new Date(new Date().getTime() + 15 * 60 * 1000), // 15 minutes from now
      });
      await CartRepository.createCart(cart);
    }

    const products = await CartRepository.getCartProducts(cart);

    for (const product of products) {
      if (product.variantId === variantId) {
        product.quantity += quantity;
        product.total = product.quantity * product.total;
        product.updatedAt = new Date();
        await CartProductRepository.AddOrUpdateCartProduct(product);
        await CartRepository.updateCart(cart);
        return;
      }
    }

    const variant = await VariantRepository.findVariantById(variantId);
    if (!variant) {
      console.error('Variant not found');
      return;
    }

    const sneaker = await SneakerRepository.findSneakerById(variant.sneakerId);
    if (!sneaker) {
      console.error('Sneaker not found');
      return;
    }

    const newProduct = CartProductRepository.build({
      cartId: cart.id,
      variantId: variantId,
      quantity: quantity,
      total: sneaker.price * quantity,
      createdAt: new Date(),
    });

    await CartProductRepository.AddOrUpdateCartProduct(newProduct);
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
    const products = await CartRepository.getCartProducts(cart);
    for (const product of products) {
      await CartProductRepository.deleteCartProduct(product);
    }
    await CartRepository.deleteCart(cart);
  }

  static async deleteProductFromCart(cartId: number, variantId: number) {
    const cart = await CartRepository.getCartById(cartId);
    if (!cart) {
      return;
    }

    const products = await CartRepository.getCartProducts(cart);
    for (const product of products) {
      if (product.variantId === variantId) {
        await CartProductRepository.deleteCartProduct(product);
      }
    }
  }
}

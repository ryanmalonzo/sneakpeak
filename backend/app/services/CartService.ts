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
        expiredAt: new Date(new Date().getMinutes() + 15),
      });
      await CartRepository.createCart(cart);
    }
    const products = await CartRepository.getCartProducts(cart);
    products.forEach(async (product) => {
      if (product.variantId === variantId) {
        product.quantity += quantity;
        product.total = product.quantity * product.total;
        product.updatedAt = new Date();
        CartProductRepository.AddOrUpdateCartProduct(product);
      }
    });

    if (products.length === 0) {
      const variant = await VariantRepository.findVariantById(variantId);
      const product = await SneakerRepository.findSneakerById(
        variant!.sneakerId,
      );
      if (!variant) {
        console.log('variant not found');
        return;
      }
      if (!product) {
        console.log('product not found');
        return;
      }
      const newProduct = CartProductRepository.build({
        cartId: cart.id,
        variantId: variantId,
        quantity: quantity,
        total: product!.price * quantity,
        createdAt: new Date(),
      });
      return await CartProductRepository.AddOrUpdateCartProduct(newProduct);
    }

    return await CartRepository.updateCart(cart);
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
    products.forEach((product) => {
      CartProductRepository.deleteCartProduct(product);
    });
    await CartRepository.deleteCart(cart);
  }

  static async deleteProductFromCart(cartId: number, variantId: number) {
    const cart = await CartRepository.getCartById(cartId);
    if (!cart) {
      return;
    }

    const products = await CartRepository.getCartProducts(cart);
    products.forEach((product) => {
      if (product.variantId === variantId) {
        CartProductRepository.deleteCartProduct(product);
      }
    });
  }
}

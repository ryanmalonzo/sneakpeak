import { CartRepository } from '../repositories/sql/CartRepository';
import { CartProductRepository } from '../repositories/sql/CartProductRepository';
import { VariantRepository } from '../repositories/sql/VariantRepository';
import { SneakerRepository } from '../repositories/sql/SneakerRepository';

export class CartService {
  static async addProductToCart(
    userId: number,
    variantId: number,
    quantity: number,
  ) {
    let cart = await CartRepository.getCartByUserId(userId);

    if (!cart) {
      cart = CartRepository.build({
        user_id: userId,
        createdAt: new Date(),
        expiredAt: new Date(new Date().getTime() + 15 * 60 * 1000), // 15 minutes from now
      });
      await CartRepository.createCart(cart);
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

    const products = await CartRepository.getCartProducts(cart);

    for (const product of products) {
      if (product.variantId === variantId) {
        if (quantity + product.quantity > variant.stock) {
          console.error('Not enough stock');
        }
        return;
      } else {
        if (quantity > variant.stock) {
          console.error('Not enough stock');
          return;
        }
      }
    }

    const newProduct = CartProductRepository.build({
      cartId: cart.id,
      variantId: variantId,
      quantity: quantity,
      total: sneaker.price * quantity,
      createdAt: new Date(),
    });

    await CartProductRepository.addCartProduct(newProduct);
    await CartRepository.updateCart(cart);
  }

  static async updateProductInCart(
    userId: number,
    variantId: number,
    quantity: number,
  ) {
    const cart = await CartRepository.getCartByUserId(userId);
    if (!cart) {
      return;
    }

    const products = await CartRepository.getCartProducts(cart);

    for (const product of products) {
      if (product.variantId === variantId) {
        const variant = await VariantRepository.findVariantById(variantId);
        if (!variant) {
          console.error('Variant not found');
          return;
        }

        const sneaker = await SneakerRepository.findSneakerById(
          variant.sneakerId,
        );
        if (!sneaker) {
          console.error('Sneaker not found');
          return;
        }

        if (quantity > variant.stock) {
          console.error('Not enough stock');
          return;
        }

        product.quantity = quantity;
        product.total = sneaker.price * quantity;
        await CartProductRepository.addCartProduct(product);
        await CartRepository.updateCart(cart);
        return;
      }
    }
  }

  static async deleteProductFromCart(userId: number, variantId: number) {
    const cart = await CartRepository.getCartByUserId(userId);
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

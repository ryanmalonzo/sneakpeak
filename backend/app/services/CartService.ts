import { CartRepository } from '../repositories/sql/CartRepository';
import { CartProductRepository } from '../repositories/sql/CartProductRepository';
import { VariantRepository } from '../repositories/sql/VariantRepository';
import { SneakerRepository } from '../repositories/sql/SneakerRepository';
import { StatusCodes } from 'http-status-codes';
import { RequestError } from '../helpers/error';

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

    if (quantity <= 0) {
      throw new RequestError(
        StatusCodes.BAD_REQUEST,
        'Quantity must be positive',
      );
    }

    const variant = await VariantRepository.findVariantById(variantId);
    if (!variant) {
      throw new RequestError(StatusCodes.NOT_FOUND, 'Variant not found');
    }

    const sneaker = await SneakerRepository.findSneakerById(variant.sneakerId);
    if (!sneaker) {
      throw new RequestError(StatusCodes.NOT_FOUND, 'Sneaker not found');
    }

    const products = await CartRepository.getCartProducts(cart);

    for (const product of products) {
      if (product.variantId === variantId) {
        if (quantity + product.quantity > variant.stock) {
          throw new RequestError(StatusCodes.BAD_REQUEST, 'Not enough stock');
        }
        return;
      } else {
        if (quantity > variant.stock) {
          throw new RequestError(StatusCodes.BAD_REQUEST, 'Not enough stock');
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
      throw new RequestError(StatusCodes.NOT_FOUND, 'Cart not found');
    }

    const products = await CartRepository.getCartProducts(cart);

    if (quantity <= 0) {
      throw new RequestError(
        StatusCodes.BAD_REQUEST,
        'Quantity must be positive',
      );
    }

    if (!products.length) {
      throw new RequestError(StatusCodes.NOT_FOUND, 'Product not found');
    }

    for (const product of products) {
      if (product.variantId === variantId) {
        const variant = await VariantRepository.findVariantById(variantId);
        if (!variant) {
          throw new RequestError(StatusCodes.NOT_FOUND, 'Variant not found');
        }

        const sneaker = await SneakerRepository.findSneakerById(
          variant.sneakerId,
        );
        if (!sneaker) {
          throw new RequestError(StatusCodes.NOT_FOUND, 'Sneaker not found');
        }

        if (quantity > variant.stock) {
          throw new RequestError(StatusCodes.BAD_REQUEST, 'Not enough stock');
        }

        product.quantity = quantity;
        product.total = sneaker.price * quantity;
        await CartProductRepository.addCartProduct(product);
        await CartRepository.updateCart(cart);
        return;
      } else {
        throw new RequestError(StatusCodes.NOT_FOUND, 'Product not found');
      }
    }
  }

  static async deleteProductFromCart(userId: number, variantId: number) {
    const cart = await CartRepository.getCartByUserId(userId);
    if (!cart) {
      throw new RequestError(StatusCodes.NOT_FOUND, 'Cart not found');
    }

    const products = await CartRepository.getCartProducts(cart);
    for (const product of products) {
      if (product.variantId === variantId) {
        await CartProductRepository.deleteCartProduct(product);
      } else {
        throw new RequestError(StatusCodes.NOT_FOUND, 'Product not found');
      }
    }
    return await CartRepository.updateCart(cart);
  }
}

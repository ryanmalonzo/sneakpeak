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
        userId: userId,
        createdAt: new Date(),
        expiredAt: new Date(new Date().getTime() + 15 * 60 * 1000), // 15 minutes from now
      });
      await CartRepository.createCart(cart);
    }

    if (quantity <= 0 || !Number.isInteger(quantity)) {
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
      name: sneaker.name,
      image: variant.image,
      unitPrice: sneaker.price,
      createdAt: new Date(),
    });

    await CartProductRepository.addCartProduct(newProduct);
    await VariantRepository.update(variant.id, {
      stock: variant.stock - quantity,
    });
    cart.expiredAt = new Date(new Date().getTime() + 15 * 60 * 1000); // 15 minutes from now
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

    if (quantity <= 0 || !Number.isInteger(quantity)) {
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
        product.unitPrice = sneaker.price;
        product.name = sneaker.name;
        product.image = variant.image;
        await CartProductRepository.addCartProduct(product);
        if (quantity > product.quantity) {
          await VariantRepository.update(variant.id, {
            stock: variant.stock - (quantity - product.quantity),
          });
        } else {
          await VariantRepository.update(variant.id, {
            stock: variant.stock + (product.quantity - quantity),
          });
        }
        cart.expiredAt = new Date(new Date().getTime() + 15 * 60 * 1000); // 15 minutes from now
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
    if (!products.length) {
      throw new RequestError(StatusCodes.NOT_FOUND, 'Product not found');
    }
    for (const product of products) {
      if (product.variantId === variantId) {
        await CartProductRepository.deleteCartProduct(product);
        const variant = await VariantRepository.findVariantById(
          product.variantId,
        );
        if (!variant) {
          throw new RequestError(StatusCodes.NOT_FOUND, 'Variant not found');
        }
        await VariantRepository.update(product.variantId, {
          stock: product.quantity + variant.stock,
        });
      } else {
        throw new RequestError(StatusCodes.NOT_FOUND, 'Product not found');
      }
    }
    cart.expiredAt = new Date(new Date().getTime() + 15 * 60 * 1000); // 15 minutes from now
    return await CartRepository.updateCart(cart);
  }

  static async getCartProducts(userId: number) {
    const cart = await CartRepository.getCartByUserId(userId);
    if (!cart) {
      throw new RequestError(StatusCodes.NOT_FOUND, 'Cart not found');
    }

    return await CartRepository.getCartProducts(cart);
  }

  static async emptyCart(userId: number) {
    const cart = await CartRepository.getCartByUserId(userId);
    if (!cart) {
      throw new RequestError(StatusCodes.NOT_FOUND, 'Cart not found');
    }
    for (const product of await CartRepository.getCartProducts(cart)) {
      const variant = await VariantRepository.findVariantById(
        product.variantId,
      );
      if (!variant) {
        throw new RequestError(StatusCodes.NOT_FOUND, 'Variant not found');
      }
      await VariantRepository.update(product.variantId, {
        stock: product.quantity + variant.stock,
      });
    }

    return await CartProductRepository.deleteAllCartProducts(
      await CartRepository.getCartProducts(cart),
    );
  }

  static async getCart(userId: number) {
    return await CartRepository.getCartByUserId(userId);
  }
}

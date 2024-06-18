import { Cart } from '../../models/sql/Cart';

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

  static async addProductToCart(
    cart: Cart,
    productId: number,
    quantity: number,
  ): Promise<void> {
    await cart.addProduct(productId, quantity);
  }

  static async removeProductFromCart(
    cart: Cart,
    productId: number,
  ): Promise<void> {
    // TODO: Retirer un produit du panier
    await cart.removeProduct(productId);
  }

  static async getCartProducts(cart: Cart): Promise<number[]> {
    const products = await cart.getCartProducts();
    return products.map((product) => product.id);
  }
}

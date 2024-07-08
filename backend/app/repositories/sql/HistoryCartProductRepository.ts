import { HistoryCartProduct } from '../../models/sql/HistoryCartProduct';

export class HistoryCartProductRepository {
  static build(data: Partial<HistoryCartProduct>): HistoryCartProduct {
    return HistoryCartProduct.build(data);
  }
  static async findHistoryCartProductsByCartId(
    cartId: number,
  ): Promise<HistoryCartProduct[]> {
    const historyCartProducts = await HistoryCartProduct.findAll({
      where: { cart_id: cartId },
    });
    return historyCartProducts;
  }

  static async addHistoryCartProduct(
    historyCartProduct: HistoryCartProduct,
  ): Promise<HistoryCartProduct> {
    return await historyCartProduct.save();
  }

  static async deleteHistoryCartProduct(
    historyCartProduct: HistoryCartProduct,
  ): Promise<void> {
    await historyCartProduct.destroy();
  }

  static async deleteAllHistoryCartProducts(
    historyCartProducts: HistoryCartProduct[],
  ): Promise<void> {
    for (const historyCartProduct of historyCartProducts) {
      await historyCartProduct.destroy();
    }
  }
}

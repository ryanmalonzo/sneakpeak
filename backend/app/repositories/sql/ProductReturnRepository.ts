import { ProductReturn } from '../../models/sql/ProductReturn';

export class ProductReturnRepository {
  static build(data: Partial<ProductReturn>): ProductReturn {
    return ProductReturn.build(data);
  }

  static async save(productReturn: ProductReturn): Promise<ProductReturn> {
    await productReturn.save();
    return productReturn;
  }

  static async update(
    id: number,
    data: Partial<ProductReturn>,
  ): Promise<ProductReturn | null> {
    const productReturn = await ProductReturn.findByPk(id);
    if (!productReturn) {
      return null;
    }
    await productReturn.update(data);
    return productReturn;
  }

  static async delete(id: number): Promise<ProductReturn | null> {
    const productReturn = await ProductReturn.findByPk(id);
    if (!productReturn) {
      return null;
    }
    await productReturn.destroy();
    return productReturn;
  }

  static async findOne(id: number): Promise<ProductReturn | null> {
    return await ProductReturn.findByPk(id);
  }

  static async findByOrderProductId(
    orderProductId: number,
  ): Promise<ProductReturn | null> {
    return await ProductReturn.findOne({
      where: {
        order_products_id: orderProductId,
      },
    });
  }
}

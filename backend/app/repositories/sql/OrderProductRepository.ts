import { OrderProduct } from '../../models/sql/OrderProduct';

export class OrderProductRepository {
  static build(data: Partial<OrderProduct>): OrderProduct {
    return OrderProduct.build(data);
  }
  static async create(orderProduct: OrderProduct): Promise<OrderProduct> {
    return orderProduct.save();
  }

  static async findAll(): Promise<OrderProduct[]> {
    return OrderProduct.findAll();
  }

  static async findById(id: number): Promise<OrderProduct | null> {
    return OrderProduct.findOne({ where: { id } });
  }

  static async findByOrderId(orderId: number): Promise<OrderProduct[]> {
    return OrderProduct.findAll({ where: { orderId } });
  }

  static async update(orderProduct: OrderProduct): Promise<OrderProduct> {
    return orderProduct.save();
  }

  static async delete(id: number): Promise<void> {
    await OrderProduct.destroy({ where: { id } });
  }

  static async findByVariantId(variantId: number): Promise<OrderProduct[]> {
    return OrderProduct.findAll({ where: { variantId } });
  }
}

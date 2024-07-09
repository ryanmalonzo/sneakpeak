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
    return OrderProduct.findByPk(id);
  }

  static async update(orderProduct: OrderProduct): Promise<OrderProduct> {
    return orderProduct.save();
  }

  static async delete(id: number): Promise<void> {
    await OrderProduct.destroy({ where: { id } });
  }
}

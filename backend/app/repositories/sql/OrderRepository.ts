import { Order } from '../../models/sql/Order';

export class OrderRepository {
  static build(data: Partial<Order>): Order {
    return Order.build(data);
  }
  static async create(order: Order): Promise<Order> {
    return order.save();
  }

  static async findAll(): Promise<Order[]> {
    return Order.findAll();
  }

  static async findById(id: number): Promise<Order | null> {
    return Order.findByPk(id);
  }

  static async update(order: Order): Promise<Order> {
    return order.save();
  }

  static async delete(id: number): Promise<void> {
    await Order.destroy({ where: { id } });
  }
}

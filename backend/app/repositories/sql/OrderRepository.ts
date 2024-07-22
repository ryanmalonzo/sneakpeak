import { Order } from '../../models/sql/Order';
import { OrderAddress } from '../../models/sql/OrderAddress';
import { OrderProduct } from '../../models/sql/OrderProduct';

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

  static async findAllByUserId(userId: number): Promise<Order[]> {
    return Order.findAll({ where: { user_id: userId } });
  }

  static async findById(id: number): Promise<Order | null> {
    return Order.findByPk(id);
  }

  static async findByReference(
    reference: string,
    userId: number,
  ): Promise<Order | null> {
    return Order.findOne({
      where: { reference, user_id: userId },
    });
  }

  static async findBySessionId(session_id: string): Promise<Order | null> {
    return Order.findOne({ where: { session_id } });
  }

  static async update(order: Order): Promise<Order> {
    return order.save();
  }

  static async delete(id: number): Promise<void> {
    await Order.destroy({ where: { id } });
  }

  static async findAddressByType(
    orderId: number,
    type: string,
  ): Promise<OrderAddress | null> {
    return OrderAddress.findOne({
      where: { orderId: orderId, type },
    });
  }

  static async findProductsByOrderId(
    orderId: number,
  ): Promise<OrderProduct[] | null> {
    return OrderProduct.findAll({
      where: { orderId: orderId },
    });
  }

  static async getPaginated(
    page: number,
    limit: number,
    userId: number,
  ): Promise<Order[]> {
    return Order.findAll({
      where: { user_id: userId },
      offset: (page - 1) * limit,
      limit: limit,
    });
  }
}

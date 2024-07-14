import { OrderRepository } from '../repositories/sql/OrderRepository';

export class OrderService {
  static async findAllOrders(userId: number) {
    return OrderRepository.findAllByUserId(userId);
  }

  static async findOrderByReference(reference: string) {
    return OrderRepository.findByReference(reference);
  }
}

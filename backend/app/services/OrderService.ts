import { OrderRepository } from '../repositories/sql/OrderRepository';

export class OrderService {
  static async findAllOrders(userId: number) {
    return OrderRepository.findAllByUserId(userId);
  }

  static async findOrderByReference(reference: string, userId: number) {
    return OrderRepository.findByReference(reference, userId);
  }

  static async findAddressByType(orderId: number, type: string) {
    return OrderRepository.findAddressByType(orderId, type);
  }

  static async findProductsByOrderId(orderId: number) {
    return OrderRepository.findProductsByOrderId(orderId);
  }
}

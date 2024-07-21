import { OrderRepository } from '../repositories/sql/OrderRepository';
import { OrderProduct } from '../models/sql/OrderProduct';
import { OrderProductRepository } from '../repositories/sql/OrderProductRepository';

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

  static async updateProduct(orderProduct: OrderProduct) {
    return OrderProductRepository.update(orderProduct);
  }
}

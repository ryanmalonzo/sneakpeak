import { OrderRepository } from '../repositories/sql/OrderRepository';
import { OrderRepository as OrderRepositoryMongo } from '../repositories/mongodb/OrderRepository';
import { OrderProduct } from '../models/sql/OrderProduct';
import { OrderProductRepository } from '../repositories/sql/OrderProductRepository';
import { HydratedDocument } from 'mongoose';
import {
  FilterOptions,
  PaginatedResponse,
  SortOptions,
} from '../helpers/interfaces';
import { IOrder } from '../models/mongodb/Order';

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

  static async getPaginated(
    q: string,
    page: number,
    limit: number,
    sortOptions: SortOptions,
    filterOptions: FilterOptions,
  ): Promise<PaginatedResponse<HydratedDocument<IOrder>>> {
    let allFilterOptions: Record<string, unknown> = {};
    if (q) {
      allFilterOptions['$or'] = [
        { reference: { $regex: q, $options: 'i' } },
        { status: { $regex: q, $options: 'i' } },
      ];
    }
    allFilterOptions = { ...allFilterOptions, ...filterOptions };

    const orders = await OrderRepositoryMongo.getPaginated(
      page,
      limit,
      sortOptions,
      allFilterOptions,
    );

    const totalCount = await OrderRepositoryMongo.getTotalCount(
      sortOptions,
      allFilterOptions,
    );

    return {
      total: totalCount,
      page,
      limit,
      items: orders,
    };
  }

  static async findOrderById(orderId: string) {
    return OrderRepositoryMongo.findById(orderId);
  }

  static async updateStatus(status: string, orderId: string) {
    console.log('status', status);
    console.log('orderId', orderId);
    return OrderRepository.updateStatus(parseInt(orderId), status);
  }
}

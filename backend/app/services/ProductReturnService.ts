import { RequestError } from '../helpers/error';
import { StatusCodes } from 'http-status-codes';
import { ProductReturn } from '../models/sql/ProductReturn';
import { ProductReturnRepository } from '../repositories/sql/ProductReturnRepository';
import { OrderProductRepository } from '../repositories/sql/OrderProductRepository';
import { OrderRepository } from '../repositories/sql/OrderRepository';

export class ProductReturnService {
  static async find(id: number): Promise<ProductReturn | null> {
    const productReturn = await ProductReturnRepository.findOne(id);
    if (!productReturn) {
      throw new RequestError(StatusCodes.NOT_FOUND);
    }
    return productReturn;
  }

  static async create(
    orderProductId: number,
    reason: string,
  ): Promise<ProductReturn> {
    if (!orderProductId) {
      console.log('orderProductId', orderProductId);
      throw new RequestError(StatusCodes.BAD_REQUEST);
    }
    if (!reason) {
      console.log('reason', reason);
      throw new RequestError(StatusCodes.BAD_REQUEST);
    }
    console.log('orderProductId', orderProductId);
    const orderProduct = await OrderProductRepository.findById(orderProductId);
    if (!orderProduct) {
      throw new RequestError(StatusCodes.NOT_FOUND);
    }
    const data = {
      orderProductId,
      reason,
      status: 'pending',
    };
    const order = await OrderRepository.findById(orderProduct.orderId);
    if (!order) {
      throw new RequestError(StatusCodes.NOT_FOUND);
    }
    // Check if order is older than 14 days
    if (order.createdAt < new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)) {
      data.status = 'pending';
    } else {
      data.status = 'approved';
    }
    console.log('data', data);
    const productReturn = ProductReturnRepository.build(data);
    console.log('productReturn', productReturn);
    await ProductReturnRepository.save(productReturn);
    return productReturn;
  }

  static async update(
    id: number,
    data: {
      orderProductId: number;
      reason: string;
      status: 'pending' | 'approved' | 'rejected';
    },
  ): Promise<ProductReturn> {
    const productReturn = await ProductReturnRepository.update(id, data);
    if (!productReturn) {
      throw new RequestError(StatusCodes.NOT_FOUND);
    }
    return productReturn;
  }
}

import { OrderAddress } from '../../models/sql/OrderAddress';

export class OrderAddressRepository {
  static build(data: Partial<OrderAddress>): OrderAddress {
    return OrderAddress.build(data);
  }

  static async save(orderAddress: OrderAddress): Promise<OrderAddress> {
    await orderAddress.save();
    return orderAddress;
  }

  static async update(
    orderAddressId: number,
    data: Partial<OrderAddress>,
  ): Promise<OrderAddress | null> {
    const orderAddress = await OrderAddress.findByPk(orderAddressId);
    if (!orderAddress) {
      return null;
    }
    return await orderAddress.update(data);
  }

  static async delete(orderAddressId: number): Promise<OrderAddress | null> {
    const orderAddress = await OrderAddress.findByPk(orderAddressId);
    if (!orderAddress) {
      return null;
    }
    await orderAddress.destroy();
    return orderAddress;
  }

  static async findOrderAddressById(
    orderAddressId: number,
  ): Promise<OrderAddress | null> {
    return await OrderAddress.findByPk(orderAddressId);
  }
}

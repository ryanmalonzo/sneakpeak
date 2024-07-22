import { HydratedDocument } from 'mongoose';
import { IOrder, OrderModel } from '../../models/mongodb/Order';
import { FilterOptions, SortOptions } from '../../helpers/interfaces';

export class OrderRepository {
  static async findAll(): Promise<HydratedDocument<IOrder>[]> {
    const order = await OrderModel.find();
    return order;
  }

  static async findOne(
    filterOptions: FilterOptions,
  ): Promise<HydratedDocument<IOrder> | null> {
    const order = await OrderModel.findOne(filterOptions);
    return order;
  }

  static async getPaginated(
    page: number,
    limit: number,
    sortOptions: SortOptions,
    filterOptions: FilterOptions,
  ): Promise<HydratedDocument<IOrder>[]> {
    const orders = await OrderModel.find(filterOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sortOptions);
    return orders;
  }

  static async getTotalCount(
    sortOptions: Record<string, unknown>,
    filterOptions: Record<string, unknown>,
  ): Promise<number> {
    return await OrderModel.countDocuments(filterOptions, sortOptions);
  }
}

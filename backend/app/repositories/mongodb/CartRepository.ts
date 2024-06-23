import { HydratedDocument } from 'mongoose';
import { ICart, CartModel } from '../../models/mongodb/Cart';

export class CartRepository {
  static async findAll(): Promise<HydratedDocument<ICart>[]> {
    return await CartModel.find();
  }

  static async findByUserId(
    userId: string,
  ): Promise<HydratedDocument<ICart> | null> {
    return await CartModel.findOne({ user: userId });
  }
}

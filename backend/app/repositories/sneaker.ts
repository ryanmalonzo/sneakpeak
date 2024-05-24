import { HydratedDocument } from 'mongoose';
import { ISneaker, SneakerModel } from '../models/sneaker';

export class SneakerRepository {
  static async getPaginated(
    page: number,
    limit: number,
  ): Promise<HydratedDocument<ISneaker>[]> {
    const sneakers = await SneakerModel.find().skip((page - 1) * limit);
    return sneakers;
  }

  static async getTotalCount(): Promise<number> {
    return await SneakerModel.countDocuments();
  }

  static async findSneakers(): Promise<HydratedDocument<ISneaker>[]> {
    return await SneakerModel.find();
  }

  static async delete(id: string): Promise<void> {
    await SneakerModel.findByIdAndDelete(id);
  }

  static async create(
    sneaker: HydratedDocument<ISneaker>,
  ): Promise<HydratedDocument<ISneaker>> {
    await sneaker.save();
    return sneaker;
  }
}

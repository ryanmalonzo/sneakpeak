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
}

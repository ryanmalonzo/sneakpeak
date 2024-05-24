import { HydratedDocument } from 'mongoose';
import { ISneaker, SneakerModel } from '../models/sneaker';
import { FilterOptions, SortOptions } from '../helpers/interfaces';

export class SneakerRepository {
  static async getPaginated(
    page: number,
    limit: number,
    sortOptions: SortOptions,
    filterOptions: FilterOptions,
  ): Promise<HydratedDocument<ISneaker>[]> {
    const sneakers = await SneakerModel.find(filterOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sortOptions);
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

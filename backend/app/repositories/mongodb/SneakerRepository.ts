import { HydratedDocument } from 'mongoose';
import { ISneaker, SneakerModel } from '../../models/mongodb/Sneaker';
import { FilterOptions, SortOptions } from '../../helpers/interfaces';

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

  static async getTotalCount(
    sortOptions: SortOptions,
    filterOptions: FilterOptions,
  ): Promise<number> {
    return await SneakerModel.countDocuments(filterOptions, sortOptions);
  }

  static async findOneById(
    id: string,
  ): Promise<HydratedDocument<ISneaker> | null> {
    return await SneakerModel.findOne({ id });
  }
}

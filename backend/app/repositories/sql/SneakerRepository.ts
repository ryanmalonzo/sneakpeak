import { HydratedDocument } from 'mongoose';
import { ISneaker, SneakerModel } from '../../models/mongodb/Sneaker';
import { FilterOptions, SortOptions } from '../../helpers/interfaces';
import { Sneaker } from '../../models/sql/Sneaker';

export class SneakerRepository {
  static async getPaginated(
    q: string,
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

  static async findSneakers(): Promise<HydratedDocument<ISneaker>[]> {
    return await SneakerModel.find();
  }

  static async findSneakerById(id: number): Promise<Sneaker | null> {
    const sneaker = await Sneaker.findByPk(id);
    return sneaker;
  }

  static async delete(id: number): Promise<void> {
    await Sneaker.findByPk(id).then((sneaker) => {
      if (sneaker) {
        sneaker.destroy();
      }
    });
  }

  static async create(
    sneaker: HydratedDocument<ISneaker>,
  ): Promise<HydratedDocument<ISneaker>> {
    await sneaker.save();
    return sneaker;
  }
}

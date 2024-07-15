import { HydratedDocument } from 'mongoose';
import { IBrand, BrandModel } from '../../models/mongodb/Brand';
import { FilterOptions, SortOptions } from '../../helpers/interfaces';

export class BrandRepository {
  static findAll(): Promise<HydratedDocument<IBrand>[]> {
    return BrandModel.find();
  }

  static findById(id: string): Promise<HydratedDocument<IBrand> | null> {
    return BrandModel.findById(id);
  }

  static async getPaginated(
    page: number,
    limit: number,
    sortOptions: SortOptions,
    filterOptions: FilterOptions,
  ): Promise<HydratedDocument<IBrand>[]> {
    const categories = await BrandModel.find(filterOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sortOptions);
    return categories;
  }

  static async getTotalCount(
    sortOptions: Record<string, unknown>,
    filterOptions: Record<string, unknown>,
  ): Promise<number> {
    return await BrandModel.countDocuments(filterOptions, sortOptions);
  }
}

import { HydratedDocument } from 'mongoose';
import { ISize, SizeModel } from '../../models/mongodb/Size';
import { FilterOptions, SortOptions } from '../../helpers/interfaces';

export class SizeRepository {
  static async getPaginated(
    page: number,
    limit: number,
    sortOptions: SortOptions,
    filterOptions: FilterOptions,
  ): Promise<HydratedDocument<ISize>[]> {
    const sizes = await SizeModel.find(filterOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sortOptions);
    return sizes;
  }

  static async getTotalCount(
    sortOptions: Record<string, unknown>,
    filterOptions: Record<string, unknown>,
  ): Promise<number> {
    return await SizeModel.countDocuments(filterOptions, sortOptions);
  }
}

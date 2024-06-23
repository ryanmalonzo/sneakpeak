import { HydratedDocument } from 'mongoose';
import { IVariant, VariantModel } from '../../models/mongodb/Variant';
import { FilterOptions, SortOptions } from '../../helpers/interfaces';

export class VariantRepository {
  static async getPaginated(
    page: number,
    limit: number,
    sortOptions: SortOptions,
    filterOptions: FilterOptions,
  ): Promise<HydratedDocument<IVariant>[]> {
    const variants = await VariantModel.find(filterOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sortOptions);
    return variants;
  }

  static async getTotalCount(
    sortOptions: SortOptions,
    filterOptions: FilterOptions,
  ): Promise<number> {
    return await VariantModel.countDocuments(filterOptions, sortOptions);
  }
}

import { HydratedDocument } from 'mongoose';
import { IColor, ColorModel } from '../../models/mongodb/Color';
import { FilterOptions, SortOptions } from '../../helpers/interfaces';

export class ColorRepository {
  static async findAll(): Promise<HydratedDocument<IColor>[]> {
    const color = await ColorModel.find();
    return color;
  }

  static async findOne(
    filterOptions: FilterOptions,
  ): Promise<HydratedDocument<IColor> | null> {
    const color = await ColorModel.findOne(filterOptions);
    return color;
  }

  static async getPaginated(
    page: number,
    limit: number,
    sortOptions: SortOptions,
    filterOptions: FilterOptions,
  ): Promise<HydratedDocument<IColor>[]> {
    const categories = await ColorModel.find(filterOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sortOptions);
    return categories;
  }

  static async getTotalCount(
    sortOptions: Record<string, unknown>,
    filterOptions: Record<string, unknown>,
  ): Promise<number> {
    return await ColorModel.countDocuments(filterOptions, sortOptions);
  }
}

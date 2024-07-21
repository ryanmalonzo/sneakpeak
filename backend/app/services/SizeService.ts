import { HydratedDocument } from 'mongoose';
import { FilterOptions, PaginatedResponse, SortOptions } from '../helpers/interfaces';
import { SizeRepository as SizeRepositoryMongoDB } from '../repositories/mongodb/SizeRepository';
import { ISize } from '../models/mongodb/Size';

export class SizeService {
  
  static async getPaginated(
    q: string,
    page: number,
    limit: number,
    sortOptions: SortOptions,
    filterOptions: FilterOptions,
  ): Promise<PaginatedResponse<HydratedDocument<ISize>>> {
    let allFilterOptions: Record<string, unknown> = {};
    if (q) {
      allFilterOptions['$or'] = [
        { name: { $regex: q, $options: 'i' } },
        { slug: { $regex: q, $options: 'i' } },
      ];
    }
    allFilterOptions = { ...allFilterOptions, ...filterOptions };

    const colors = await SizeRepositoryMongoDB.getPaginated(
      page,
      limit,
      sortOptions,
      allFilterOptions,
    );

    const totalCount = await SizeRepositoryMongoDB.getTotalCount(
      sortOptions,
      allFilterOptions,
    );

    return {
      total: totalCount,
      page,
      limit,
      items: colors,
    };
  }
    
}

import { HydratedDocument } from 'mongoose';
import { FilterOptions, SortOptions } from '../helpers/interfaces';
import { VariantRepository as VariantRepositoryMongo } from '../repositories/mongodb/VariantRepository';
import { IVariant } from '../models/mongodb/Variant';
import { Variant, VariantDTO } from '../models/sql/Variant';
import { VariantRepository } from '../repositories/sql/VariantRepository';

interface PaginatedVariantsResponse {
  total: number;
  page: number;
  limit: number;
  items: HydratedDocument<IVariant>[];
}

export class VariantService {
  public static async getPaginated(
    q: string,
    page: number,
    limit: number,
    sortOptions: SortOptions,
    filterOptions: FilterOptions,
  ): Promise<PaginatedVariantsResponse> {
    let allFilterOptions: Record<string, unknown> = {};
    if (q) {
      allFilterOptions['$or'] = [
        { name: { $regex: q, $options: 'i' } },
        { size: { $regex: q, $options: 'i' } },
        { color: { $regex: q, $options: 'i' } },
      ];
    }
    allFilterOptions = { ...allFilterOptions, ...filterOptions };

    const variants = await VariantRepositoryMongo.getPaginated(
      page,
      limit,
      sortOptions,
      allFilterOptions,
    );

    // Pour en déduire le nombre total de pages à afficher sur la web app
    // https://www.reddit.com/r/csharp/comments/uepldu/how_to_get_total_count_of_records_and_pagination/
    const totalCount = await VariantRepositoryMongo.getTotalCount(
      sortOptions,
      allFilterOptions,
    );

    return {
      total: totalCount,
      page,
      limit,
      items: variants,
    };
  }

  public static async create(variant: VariantDTO): Promise<Variant> {
    return await VariantRepository.create(variant);
  }

  public static async partialUpdate(
    id: number,
    variant: VariantDTO,
  ): Promise<Variant | null> {
    return await VariantRepository.partialUpdate(id, variant);
  }

  public static async delete(id: number): Promise<number> {
    return await VariantRepository.delete(id);
  }
}

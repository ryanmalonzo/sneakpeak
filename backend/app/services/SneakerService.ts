import { HydratedDocument } from 'mongoose';
import { SneakerRepository } from '../repositories/sql/SneakerRepository';
import { ISneaker, SneakerModel } from '../models/mongodb/Sneaker';
import { FilterOptions, SortOptions } from '../helpers/interfaces';
import { SneakerRepository as SneakerRepositoryMongo } from '../repositories/mongodb/SneakerRepository';

interface PaginatedSneakersResponse {
  total: number;
  page: number;
  limit: number;
  items: HydratedDocument<ISneaker>[];
}

export class SneakerService {
  public static async getPaginated(
    q: string,
    page: number,
    limit: number,
    sortOptions: SortOptions,
    filterOptions: FilterOptions,
  ): Promise<PaginatedSneakersResponse> {
    let allFilterOptions: Record<string, unknown> = {};
    if (q) {
      allFilterOptions['$or'] = [
        { name: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { 'variants.color': { $regex: q, $options: 'i' } },
        { 'variants.size': { $regex: q, $options: 'i' } },
      ];
    }
    allFilterOptions = { ...allFilterOptions, ...filterOptions };

    const sneakers = await SneakerRepositoryMongo.getPaginated(
      page,
      limit,
      sortOptions,
      allFilterOptions,
    );

    // Pour en déduire le nombre total de pages à afficher sur la web app
    // https://www.reddit.com/r/csharp/comments/uepldu/how_to_get_total_count_of_records_and_pagination/
    const totalCount = await SneakerRepositoryMongo.getTotalCount(
      sortOptions,
      allFilterOptions,
    );

    return {
      total: totalCount,
      page,
      limit,
      items: sneakers,
    };
  }

  public static async findOneById(
    id: string,
  ): Promise<HydratedDocument<ISneaker> | null> {
    return await SneakerRepositoryMongo.findOneById(id);
  }

  public static async delete(id: number): Promise<void> {
    return await SneakerRepository.delete(id);
  }

  public static async create(
    reference: string,
    name: string,
    description: string,
    price: number,
    category: string,
    brand: string,
    coverImage: string,
    isBest: boolean,
    isActive: boolean,
    colors: {
      name: string;
      image: string;
      sizes: {
        reference: string;
        size: number;
        stock: number;
      }[];
    }[],
  ): Promise<void> {
    const sneaker = new SneakerModel({
      reference,
      name,
      description,
      price,
      category,
      brand,
      coverImage,
      isBest,
      isActive,
      colors,
    });
    await SneakerRepository.create(sneaker);
  }
}

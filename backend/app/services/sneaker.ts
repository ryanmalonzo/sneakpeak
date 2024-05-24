import { HydratedDocument } from 'mongoose';
import { SneakerRepository } from '../repositories/sneaker';
import { ISneaker, SneakerModel } from '../models/sneaker';
import { FilterOptions, SortOptions } from '../helpers/interfaces';

interface PaginatedSneakersResponse {
  total: number;
  page: number;
  limit: number;
  items: HydratedDocument<ISneaker>[];
}

export class SneakerService {
  public static async getPaginated(
    page: number,
    limit: number,
    sortOptions: SortOptions,
    filterOptions: FilterOptions,
  ): Promise<PaginatedSneakersResponse> {
    const sneakers = await SneakerRepository.getPaginated(
      page,
      limit,
      sortOptions,
      filterOptions,
    );

    // Pour en déduire le nombre total de pages à afficher sur la web app
    const totalCount = await SneakerRepository.getTotalCount();

    return {
      total: totalCount,
      page,
      limit,
      items: sneakers,
    };
  }

  public static async findSneakers(): Promise<HydratedDocument<ISneaker>[]> {
    return await SneakerRepository.findSneakers();
  }

  public static async delete(id: string): Promise<void> {
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

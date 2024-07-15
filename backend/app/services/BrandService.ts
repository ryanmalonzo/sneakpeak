import { BrandRepository } from '../repositories/sql/BrandRepository';
import { BrandRepository as BrandRepositoryMongoDB } from '../repositories/mongodb/BrandRepository';
import { Brand } from '../models/sql/Brand';
import { RequestError } from '../helpers/error';
import { StatusCodes } from 'http-status-codes';
import { HydratedDocument } from 'mongoose';
import { IBrand } from '../models/mongodb/Brand';
import {
  FilterOptions,
  PaginatedResponse,
  SortOptions,
} from '../helpers/interfaces';

export class BrandService {
  static async findAll(): Promise<HydratedDocument<IBrand>[]> {
    return BrandRepositoryMongoDB.findAll();
  }

  static async save(name: string, slug: string, image: string): Promise<Brand> {
    const brand = BrandRepository.build({
      name,
      slug,
      image,
    });
    await BrandRepository.save(brand);
    return brand;
  }

  static async createOrUpdate(
    id: number,
    name: string,
    slug: string,
    image: string,
  ): Promise<{ created: boolean; brand: Brand }> {
    const { created, brand } = await BrandRepository.updateOrCreate(id, {
      name,
      slug,
      image,
    });
    return { created, brand };
  }

  static async delete(id: number): Promise<Brand> {
    const brand = await BrandRepository.delete(id);
    if (!brand) {
      throw new RequestError(StatusCodes.NOT_FOUND);
    }
    return brand;
  }

  static async getPaginated(
    q: string,
    page: number,
    limit: number,
    sortOptions: SortOptions,
    filterOptions: FilterOptions,
  ): Promise<PaginatedResponse<HydratedDocument<IBrand>>> {
    let allFilterOptions: Record<string, unknown> = {};
    if (q) {
      allFilterOptions['$or'] = [
        { name: { $regex: q, $options: 'i' } },
        { slug: { $regex: q, $options: 'i' } },
      ];
    }
    allFilterOptions = { ...allFilterOptions, ...filterOptions };

    const brands = await BrandRepositoryMongoDB.getPaginated(
      page,
      limit,
      sortOptions,
      allFilterOptions,
    );

    const totalCount = await BrandRepositoryMongoDB.getTotalCount(
      sortOptions,
      allFilterOptions,
    );

    return {
      total: totalCount,
      page,
      limit,
      items: brands,
    };
  }
}

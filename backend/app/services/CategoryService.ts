import { CategoryRepository } from '../repositories/sql/CategoryRepository';
import { CategoryRepository as CategoryRepositoryMongoDB } from '../repositories/mongodb/CategoryRepository';
import { ICategory } from '../models/mongodb/Category';
import { HydratedDocument } from 'mongoose';
import { Category } from '../models/sql/Category';
import { RequestError } from '../helpers/error';
import { StatusCodes } from 'http-status-codes';
import {
  FilterOptions,
  PaginatedResponse,
  SortOptions,
} from '../helpers/interfaces';

export class CategoryService {
  static async findAll(): Promise<HydratedDocument<ICategory>[]> {
    const categories = await CategoryRepositoryMongoDB.findAll();
    return categories;
  }

  static async find(
    filterOptions: FilterOptions,
  ): Promise<HydratedDocument<ICategory> | null> {
    const category = await CategoryRepositoryMongoDB.findOne(filterOptions);
    if (!category) {
      throw new RequestError(StatusCodes.NOT_FOUND);
    }
    return category;
  }

  static async save(name: string, image: string): Promise<Category> {
    const category = CategoryRepository.build({
      name,
      image,
    });
    await CategoryRepository.save(category);
    return category;
  }

  static async createOrUpdate(
    id: number,
    name: string,
    image: string,
  ): Promise<{ created: boolean; category: Category }> {
    const { created, category } = await CategoryRepository.updateOrCreate(id, {
      name,
      image,
    });
    return { created, category };
  }

  static async delete(id: number): Promise<Category> {
    const category = await CategoryRepository.delete(id);
    if (!category) {
      throw new RequestError(StatusCodes.NOT_FOUND);
    }
    return category;
  }

  static async getPaginated(
    q: string,
    page: number,
    limit: number,
    sortOptions: SortOptions,
    filterOptions: FilterOptions,
  ): Promise<PaginatedResponse<HydratedDocument<ICategory>>> {
    let allFilterOptions: Record<string, unknown> = {};
    if (q) {
      allFilterOptions['$or'] = [
        { name: { $regex: q, $options: 'i' } },
        { slug: { $regex: q, $options: 'i' } },
      ];
    }
    allFilterOptions = { ...allFilterOptions, ...filterOptions };

    const categories = await CategoryRepositoryMongoDB.getPaginated(
      page,
      limit,
      sortOptions,
      allFilterOptions,
    );

    const totalCount = await CategoryRepositoryMongoDB.getTotalCount(
      sortOptions,
      allFilterOptions,
    );

    return {
      total: totalCount,
      page,
      limit,
      items: categories,
    };
  }
}

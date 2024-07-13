import { CategoryRepository } from '../repositories/sql/CategoryRepository';
import { CategoryRepository as CategoryRepositoryMongoDB } from '../repositories/mongodb/CategoryRepository';
import { ICategory } from '../models/mongodb/Category';
import { HydratedDocument } from 'mongoose';
import { Category } from '../models/sql/Category';
import { RequestError } from '../helpers/error';
import { StatusCodes } from 'http-status-codes';

export class CategoryService {
  static async findAll(): Promise<HydratedDocument<ICategory>[]> {
    return CategoryRepositoryMongoDB.findAll();
  }

  static async save(
    name: string,
    slug: string,
    image: string,
  ): Promise<Category> {
    const category = CategoryRepository.build({
      name,
      slug,
      image,
    });
    await CategoryRepository.save(category);
    return category;
  }

  static async createOrUpdate(
    id: number,
    name: string,
    slug: string,
    image: string,
  ): Promise<{ created: boolean; category: Category }> {
    const { created, category } = await CategoryRepository.updateOrCreate(id, {
      name,
      slug,
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
}

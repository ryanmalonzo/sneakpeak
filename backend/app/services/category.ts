import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
import { CategoryRepository } from '../repositories/category';
import { CategoryModel, ICategory } from '../models/category';
import slugify from 'slugify';

export class CategoryService {
  static async create(
    name: string,
    image?: string,
    isBest?: boolean,
    isActive?: boolean,
  ): Promise<void> {
    const slug = slugify(name, { lower: true });
    const category = new CategoryModel({ name, slug, image, isBest, isActive });
    await CategoryRepository.create(category);
  }

  static async delete(categoryId: ObjectId): Promise<void> {
    await CategoryRepository.delete(categoryId);
  }

  static async update(
    categoryId: ObjectId,
    data: Partial<ICategory>,
  ): Promise<HydratedDocument<ICategory> | null> {
    return await CategoryRepository.update(categoryId, data);
  }
  static async findCategories(): Promise<HydratedDocument<ICategory>[]> {
    return await CategoryRepository.findCategories();
  }
}

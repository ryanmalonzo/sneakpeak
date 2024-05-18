import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
import { CategoryModel, ICategory } from '../models/category';

export class CategoryRepository {
  static async create(
    category: HydratedDocument<ICategory>,
  ): Promise<HydratedDocument<ICategory>> {
    await category.save();
    return category;
  }

  static async update(
    categoryId: ObjectId,
    data: Partial<ICategory>,
  ): Promise<HydratedDocument<ICategory> | null> {
    return await CategoryModel.findByIdAndUpdate(categoryId, data, {
      new: true,
    });
  }

  static async delete(
    categoryId: ObjectId,
  ): Promise<HydratedDocument<ICategory> | null> {
    return await CategoryModel.findByIdAndDelete(categoryId);
  }

  static async findById(
    categoryId: ObjectId,
  ): Promise<HydratedDocument<ICategory> | null> {
    return await CategoryModel.findById(categoryId);
  }

  static async findCategories(): Promise<HydratedDocument<ICategory>[]> {
    return await CategoryModel.find();
  }
}

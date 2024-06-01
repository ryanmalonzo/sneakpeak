import { HydratedDocument } from 'mongoose';
import { ICategory, CategoryModel } from '../../models/mongodb/Category';

export class CategoryRepository {
  static findAll(): Promise<HydratedDocument<ICategory>[]> {
    return CategoryModel.find();
  }

  static findById(id: string): Promise<HydratedDocument<ICategory> | null> {
    return CategoryModel.findById(id);
  }
}

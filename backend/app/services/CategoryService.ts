import { CategoryRepository } from '../repositories/mongodb/CategoryRepository';
import { ICategory } from '../models/mongodb/Category';
import { HydratedDocument } from 'mongoose';

export class CategoryService {
  static async findAll(): Promise<HydratedDocument<ICategory>[]> {
    return CategoryRepository.findAll();
  }
}

import { HydratedDocument } from 'mongoose';
import { IBrand, BrandModel } from '../../models/mongodb/Brand';

export class BrandRepository {
  static findAll(): Promise<HydratedDocument<IBrand>[]> {
    return BrandModel.find();
  }

  static findById(id: string): Promise<HydratedDocument<IBrand> | null> {
    return BrandModel.findById(id);
  }
}

import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
import { BrandModel, IBrand } from '../models/brand';

export class BrandRepository {
  static async create(
    brand: HydratedDocument<IBrand>,
  ): Promise<HydratedDocument<IBrand>> {
    await brand.save();
    return brand;
  }

  static async update(
    brandId: ObjectId,
    data: Partial<IBrand>,
  ): Promise<HydratedDocument<IBrand> | null> {
    return await BrandModel.findByIdAndUpdate(brandId, data, { new: true });
  }

  static async delete(
    brandId: string,
  ): Promise<HydratedDocument<IBrand> | null> {
    return await BrandModel.findByIdAndDelete(brandId);
  }

  static async findById(
    brandId: string,
  ): Promise<HydratedDocument<IBrand> | null> {
    return await BrandModel.findById(brandId);
  }

  static async findBrands(): Promise<HydratedDocument<IBrand>[]> {
    return await BrandModel.find();
  }

  static async findBrandsByIsBest(): Promise<HydratedDocument<IBrand>[]> {
    return await BrandModel.find({ isBest: true });
  }
}

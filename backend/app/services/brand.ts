import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
import { BrandRepository } from '../repositories/brand';
import { BrandModel, IBrand } from '../models/brand';
import slugify from 'slugify';

export class BrandService {
  static async create(
    name: string,
    image?: string,
    isBest?: boolean,
    isActive?: boolean,
  ): Promise<void> {
    const slug = slugify(name, { lower: true });
    const brand = new BrandModel({ name, slug, image, isBest, isActive });
    await BrandRepository.create(brand);
  }

  static async delete(brandId: string): Promise<void> {
    await BrandRepository.delete(brandId);
  }

  static async update(
    brandId: ObjectId,
    data: Partial<IBrand>,
  ): Promise<HydratedDocument<IBrand> | null> {
    return await BrandRepository.update(brandId, data);
  }

  static async findBrands(): Promise<HydratedDocument<IBrand>[]> {
    return await BrandRepository.findBrands();
  }

  static async findById(
    brandId: string,
  ): Promise<HydratedDocument<IBrand> | null> {
    return await BrandRepository.findById(brandId);
  }
}

import { BrandRepository } from '../repositories/sql/BrandRepository';
import { BrandRepository as BrandRepositoryMongoDB } from '../repositories/mongodb/BrandRepository';
import { Brand } from '../models/sql/Brand';
import { RequestError } from '../helpers/error';
import { StatusCodes } from 'http-status-codes';
import { HydratedDocument } from 'mongoose';
import { IBrand } from '../models/mongodb/Brand';

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
}

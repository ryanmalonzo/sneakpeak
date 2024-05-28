import { BrandRepository } from '../repositories/BrandRepository';
import { Sneaker } from '../models/sql/Sneaker';

export class BrandService {
  static async save(name: string, slug: string): Promise<void> {
    const sneaker = BrandRepository.build({
      name,
      slug,
    });
    await BrandRepository.save(sneaker);
  }

  static async update(id: number, name: string, slug: string): Promise<void> {
    const brand = await BrandRepository.update(id, { name, slug });
    if (!brand) {
      throw new Error('Brand not found');
    }
  }

  static async delete(id: number): Promise<void> {
    const brand = await BrandRepository.delete(id);
    if (!brand) {
      throw new Error('Brand not found');
    }
  }
}

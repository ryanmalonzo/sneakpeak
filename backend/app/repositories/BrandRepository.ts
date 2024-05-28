import { Brand } from '../models/sql/Brand';

export class BrandRepository {
  static build(data: Partial<Brand>): Brand {
    return Brand.build(data);
  }

  static async save(brand: Brand): Promise<Brand> {
    await brand.save();
    return brand;
  }

  static async update(
    brandId: number,
    data: Partial<Brand>,
  ): Promise<Brand | null> {
    const brand = await Brand.findByPk(brandId);
    if (!brand) {
      return null;
    }
    return await brand.update(data);
  }

  static async delete(brandId: number): Promise<number> {
    return await Brand.destroy({ where: { id: brandId } });
  }
}

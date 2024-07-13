import { Brand } from '../../models/sql/Brand';

export class BrandRepository {
  static build(data: Partial<Brand>): Brand {
    return Brand.build(data);
  }

  static async save(brand: Brand): Promise<Brand> {
    await brand.save();
    return brand;
  }

  static async updateOrCreate(
    brandId: number,
    data: Partial<Brand>,
  ): Promise<{ created: boolean; brand: Brand }> {
    let brand = await Brand.findByPk(brandId);

    if (!brand) {
      brand = await Brand.create(data);
      return { created: true, brand };
    }

    brand = await brand.update(data);
    return { created: false, brand };
  }

  static async delete(brandId: number): Promise<Brand | null> {
    const brand = await Brand.findByPk(brandId);
    if (!brand) {
      return null;
    }
    await brand.destroy();
    return brand;
  }

  static async findBrandById(brandId: number): Promise<Brand | null> {
    return await Brand.findByPk(brandId);
  }
}

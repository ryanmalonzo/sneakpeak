import { Variant } from '../../models/sql/Variant';

export class VariantRepository {
  static build(data: Partial<Variant>): Variant {
    return Variant.build(data);
  }

  static async save(variant: Variant): Promise<Variant> {
    await variant.save();
    return variant;
  }

  static async update(
    variantId: number,
    data: Partial<Variant>,
  ): Promise<Variant | null> {
    const variant = await Variant.findByPk(variantId);
    if (!variant) {
      return null;
    }
    return await variant.update(data);
  }

  static async delete(variantId: number): Promise<Variant | null> {
    const variant = await Variant.findByPk(variantId);
    if (!variant) {
      return null;
    }
    await variant.destroy();
    return variant;
  }

  static async findVariantById(variantId: number): Promise<Variant | null> {
    return await Variant.findByPk(variantId);
  }

  static async findVariantsBySneakerId(sneakerId: number): Promise<Variant[]> {
    return await Variant.findAll({ where: { sneakerId } });
  }
}

import { Color } from '../../models/sql/Color';
import { Size } from '../../models/sql/Size';
import { Variant, VariantDTO } from '../../models/sql/Variant';

export class VariantRepository {
  static build(data: Partial<Variant>): Variant {
    return Variant.build(data);
  }

  static async save(variant: Variant): Promise<Variant> {
    await variant.save();
    return variant;
  }

  static async create(variant: Partial<Variant>): Promise<Variant> {
    return await Variant.create(variant);
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

  static async partialUpdate(
    id: number,
    variant: VariantDTO,
  ): Promise<Variant | null> {
    const [_nbUpdated, updatedVariant] = await Variant.update(variant, {
      where: { id },
      individualHooks: true,
      returning: true,
    });

    return updatedVariant[0];
  }

  static async delete(id: number): Promise<number> {
    return await Variant.destroy({ where: { id }, individualHooks: true });
  }

  static async findVariantById(variantId: number): Promise<Variant | null> {
    return await Variant.findByPk(variantId);
  }

  static async findVariantsBySneakerId(sneakerId: number): Promise<Variant[]> {
    return await Variant.findAll({ where: { sneakerId } });
  }

  static async findVariantBySneakerIdAndColorId(
    sneakerId: number,
    colorId: number,
  ): Promise<Variant | null> {
    return await Variant.findOne({ where: { sneakerId, colorId } });
  }

  static async findVariantBySneakerIdAndColorIdAndSizeId(
    sneakerId: number,
    colorId: number,
    sizeId: number,
  ): Promise<Variant | null> {
    return await Variant.findOne({ where: { sneakerId, colorId, sizeId } });
  }

  static async findAllColorsVariantForOneSneaker(
    sneakerId: number,
  ): Promise<Color[]> {
    return await Color.findAll({
      include: [{ model: Variant, required: true, where: { sneakerId } }],
    });
  }

  static async findAllSizesForAColorSneaker(
    sneakerId: number,
    colorId: number,
  ): Promise<Size[]> {
    return await Size.findAll({
      include: [
        { model: Variant, required: true, where: { sneakerId, colorId } },
      ],
    });
  }

  static async findAllVariantsByColorId(colorId: number): Promise<Variant[]> {
    return await Variant.findAll({ where: { colorId } });
  }
}

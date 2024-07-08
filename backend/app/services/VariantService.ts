import { Variant, VariantDTO } from '../models/sql/Variant';
import { VariantRepository } from '../repositories/sql/VariantRepository';
import { RequestError } from '../helpers/error';
import { StatusCodes } from 'http-status-codes';

export class VariantService {
  public static async create(variant: VariantDTO): Promise<Variant> {
    if (await this.isVariantExists(variant)) {
      throw new RequestError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        'Variant already exists',
      );
    }

    return await VariantRepository.create(variant);
  }

  public static async partialUpdate(
    id: number,
    variant: VariantDTO,
  ): Promise<Variant | null> {
    return await VariantRepository.partialUpdate(id, variant);
  }

  public static async delete(id: number): Promise<number> {
    return await VariantRepository.delete(id);
  }

  private static async isVariantExists(variant: VariantDTO): Promise<boolean> {
    const isSneakerAlreadyExists =
      await VariantRepository.findVariantBySneakerIdAndColorIdAndSizeId(
        variant.sneakerId,
        variant.colorId,
        variant.sizeId,
      );

    return !!isSneakerAlreadyExists;
  }
}

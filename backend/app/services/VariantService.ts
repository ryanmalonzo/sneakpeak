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
    const isSneakerAlreadyExists =
      await VariantRepository.findVariantBySneakerIdAndColorIdAndSizeId(
        variant.sneakerId,
        variant.colorId,
        variant.sizeId,
      );
    if (isSneakerAlreadyExists && id !== isSneakerAlreadyExists?.id) {
      throw new RequestError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        'Variant already exists',
      );
    }
    
    const isVariantExists = await VariantRepository.partialUpdate(id, variant);

    if (!isVariantExists) {
      throw new RequestError(StatusCodes.NOT_FOUND, 'Variant not found');
    }

    const variantsForSneaker = await VariantRepository.findVariantsBySneakerIdAndColorId(
      variant.sneakerId, variant.colorId,
    );

    if (!variantsForSneaker) {
      return isVariantExists;
    }
    
    for (const otherVariants of variantsForSneaker) {
      await VariantRepository.partialUpdate(otherVariants.id, { image: variant.image });
    }

    return isVariantExists;
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

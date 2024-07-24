import { HydratedDocument } from 'mongoose';
import { ISneaker, SneakerModel } from '../../models/mongodb/Sneaker';
import { FilterOptions, SortOptions } from '../../helpers/interfaces';

export interface FlattenedSneakerVariant {
  _id: string;
  sneakerId: number;
  sneakerName: string;
  sneakerSlug: string;
  sneakerDescription: string;
  sneakerPrice: number;
  sneakerCategory: string;
  sneakerBrand: string;
  sneakerCategoryId: number;
  sneakerBrandId: number;
  variantId: number;
  variantName: string;
  variantHexCode: string;
  variantSlug: string;
  variantImage: string;
  variantIsBest: boolean;
  id: number;
  sizeId: number;
  sizeName: string;
  sizeSlug: string;
  sizeStock: number;
}

export class SneakerRepository {
  static async getPaginated(
    page: number,
    limit: number,
    sortOptions: SortOptions,
    filterOptions: FilterOptions,
  ): Promise<HydratedDocument<ISneaker>[]> {
    const sneakers = await SneakerModel.find(filterOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sortOptions);
    return sneakers;
  }

  static async getTotalCount(
    sortOptions: SortOptions,
    filterOptions: FilterOptions,
  ): Promise<number> {
    return await SneakerModel.countDocuments(filterOptions, sortOptions);
  }

  // Utilisé pour la page d'accueil, afin de query les variants directement et non les sneakers
  static async getVariantsPaginated(
    page: number,
    limit: number,
    sortOptions: SortOptions,
    filterOptions: FilterOptions,
  ): Promise<FlattenedSneakerVariant[]> {
    const skip = (page - 1) * limit;

    const pipeline = [
      // Extrait les variants
      { $unwind: '$variants' },
      { $unwind: '$variants.sizes' },

      // Applique les filtres ([!] basés sur SneakerModel, par exemple 'variants.isBest'' au lieu de 'isBest')
      { $match: filterOptions },

      // Projection pour formater les données de sortie
      {
        $project: {
          sneakerId: '$id',
          sneakerName: '$name',
          sneakerSlug: '$slug',
          sneakerDescription: '$description',
          sneakerPrice: '$price',
          sneakerCategory: '$category',
          sneakerBrand: '$brand',
          sneakerCategoryId: '$categoryId',
          sneakerBrandId: '$brandId',
          sneakerCreatedAt: '$createdAt',
          variantId: '$variants.id',
          variantName: '$variants.name',
          variantHexCode: '$variants.hexCode',
          variantSlug: '$variants.slug',
          variantImage: '$variants.image',
          variantIsBest: '$variants.isBest',
          id: '$variants.sizes.idRef',
          sizeId: '$variants.sizes.id',
          sizeName: '$variants.sizes.name',
          sizeSlug: '$variants.sizes.slug',
          sizeStock: '$variants.sizes.stock',
        },
      },

      { $sort: sortOptions },
      { $skip: skip },
      { $limit: limit },
    ];

    const flattenedVariants = await SneakerModel.aggregate(pipeline);
    return flattenedVariants;
  }

  static async getVariantsTotalCount(
    filterOptions: FilterOptions,
  ): Promise<number> {
    const pipeline = [
      // Unwind the variants array
      { $unwind: '$variants' },

      // Match stage for filtering
      { $match: filterOptions },

      // Group stage to count the total documents
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ];

    const result = await SneakerModel.aggregate(pipeline);
    return result.length > 0 ? result[0].count : 0;
  }

  static async getVariantById(
    variantId: number,
  ): Promise<FlattenedSneakerVariant> {
    const pipeline = [
      { $unwind: '$variants' },
      { $unwind: '$variants.sizes' },
      { $match: { 'variants.sizes.idRef': variantId } },
      {
        $project: {
          sneakerId: '$id',
          sneakerName: '$name',
          sneakerSlug: '$slug',
          sneakerDescription: '$description',
          sneakerPrice: '$price',
          sneakerCategory: '$category',
          sneakerBrand: '$brand',
          sneakerCategoryId: '$categoryId',
          sneakerBrandId: '$brandId',
          variantId: '$variants.id',
          variantName: '$variants.name',
          variantHexCode: '$variants.hexCode',
          variantSlug: '$variants.slug',
          variantImage: '$variants.image',
          variantIsBest: '$variants.isBest',
          variantIdRef: '$variants.sizes.idRef',
          sizeId: '$variants.sizes.id',
          sizeName: '$variants.sizes.name',
          sizeSlug: '$variants.sizes.slug',
          sizeStock: '$variants.sizes.stock',
        },
      },
    ];

    const flattenedVariant = await SneakerModel.aggregate(pipeline);
    return flattenedVariant[0];
  }

  static async findOne(
    filterOptions: FilterOptions,
  ): Promise<HydratedDocument<ISneaker> | null> {
    const sneaker = await SneakerModel.findOne(filterOptions);
    return sneaker;
  }

  static async findOneBySlug(
    slug: string,
  ): Promise<HydratedDocument<ISneaker> | null> {
    return await SneakerModel.findOne({ slug: slug });
  }
}

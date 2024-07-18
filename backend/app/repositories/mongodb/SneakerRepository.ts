import { HydratedDocument } from 'mongoose';
import { ISneaker, SneakerModel } from '../../models/mongodb/Sneaker';
import { FilterOptions, SortOptions } from '../../helpers/interfaces';

export interface FlattenedSneakerVariant {
  sneakerId: number;
  sneakerName: string;
  sneakerDescription: string;
  sneakerPrice: number;
  sneakerCategory: string;
  sneakerBrand: string;
  variantId: number;
  variantName: string;
  variantSlug: string;
  variantImage: string;
  variantIsBest: boolean;
  variantSizes: {
    idRef: number;
    id: number;
    name: string;
    slug: string;
    stock: number;
  }[];
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

      // Applique les filtres ([!] basés sur SneakerModel, par exemple 'variants.isBest'' au lieu de 'isBest')
      { $match: filterOptions },

      // Projection pour formater les données de sortie
      {
        $project: {
          id: '$variants.id',
          name: '$variants.name',
          slug: '$variants.slug',
          image: '$variants.image',
          isBest: '$variants.isBest',
          sizes: '$variants.sizes',
          sneakerId: '$_id',
          sneakerName: '$name',
          sneakerDescription: '$description',
          sneakerPrice: '$price',
          sneakerCategory: '$category',
          sneakerBrand: '$brand',
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

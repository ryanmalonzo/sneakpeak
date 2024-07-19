import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  Model,
  Sequelize,
} from 'sequelize';
import slugify from 'slugify';
import { Category } from './Category';
import { Brand } from './Brand';
import syncWithMongoDB from '../../helpers/syncPsqlMongo';
import { BrandRepository } from '../../repositories/sql/BrandRepository';
import { CategoryRepository } from '../../repositories/sql/CategoryRepository';
import { VariantRepository } from '../../repositories/sql/VariantRepository';

export interface SneakerDTO {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  brandId: number;
}

export class Sneaker extends Model {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: string;
  declare price: number;
  declare categoryId: ForeignKey<Category['id']>;
  declare brandId: ForeignKey<Brand['id']>;
}

export const updateSneakerInMongoDB = async (sneaker: Sneaker) => {
  const data = sneaker.toJSON();
  const category = await CategoryRepository.findCategoryById(data.categoryId);
  const brand = await BrandRepository.findBrandById(data.brandId);
  data.category = category!.name;
  data.brand = brand!.name;
  data.categoryId = category!.id;
  data.brandId = brand!.id;

  const sneakerSlug = slugify(data.name, { lower: true });
  data.slug = sneakerSlug;

  const colors = await VariantRepository.findAllColorsVariantForOneSneaker(
    data.id,
  );

  data.variants = await Promise.all(
    colors.map(async (color) => {
      const variantColor =
        await VariantRepository.findVariantBySneakerIdAndColorId(
          data.id,
          color.id,
        );
      const sizes = await VariantRepository.findAllSizesForAColorSneaker(
        data.id,
        color.id,
      );
      const colorSlug = color.name.replace(/\s/g, '-').toLowerCase();

      return {
        id: color?.id,
        name: color.name,
        slug: `${sneakerSlug}|${colorSlug}`,
        image: variantColor?.image,
        isBest: variantColor?.isBest,
        sizes: await Promise.all(
          sizes.map(async (size) => {
            const variant =
              await VariantRepository.findVariantBySneakerIdAndColorIdAndSizeId(
                data.id,
                color.id,
                size.id,
              );
            if (!variant) return;
            const sizeSlug = size.name.replace(/\s/g, '-').toLowerCase();
            return {
              idRef: variant.id,
              id: size.id,
              name: size.name,
              slug: `${sneakerSlug}|${colorSlug}|${sizeSlug}`,
              stock: variant?.stock,
            };
          }),
        ),
      };
    }),
  );

  await syncWithMongoDB(sneaker.constructor.name, 'update', data);
};

export default (sequelize: Sequelize) => {
  Sneaker.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    { sequelize, underscored: true },
  );

  Sneaker.afterCreate(async (sneaker) => {
    const data = sneaker.toJSON();
    const category = await CategoryRepository.findCategoryById(data.categoryId);
    const brand = await BrandRepository.findBrandById(data.brandId);
    data.category = category!.name;
    data.brand = brand!.name;
    const sneakerSlug = data.name.replace(/\s/g, '-').toLowerCase();
    data.slug = `${sneakerSlug}`;
    data.variants = [];
    await syncWithMongoDB(sneaker.constructor.name, 'create', data);
  });

  Sneaker.afterUpdate(updateSneakerInMongoDB);

  Sneaker.afterDestroy(async (sneaker) => {
    const data = sneaker.toJSON();
    await syncWithMongoDB(sneaker.constructor.name, 'delete', data);
  });

  return Sneaker;
};

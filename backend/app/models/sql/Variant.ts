import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  Model,
  Sequelize,
} from 'sequelize';
import { Sneaker, updateSneakerInMongoDB } from './Sneaker';
import { Size } from './Size';
import { Color } from './Color';
import syncWithMongoDB from '../../helpers/syncPsqlMongo';
import { VariantRepository } from '../../repositories/sql/VariantRepository';

export interface VariantDTO {
  stock: number;
  image: string;
  isBest: boolean;
  sneakerId: number;
  sizeId: number;
  colorId: number;
}

export class Variant extends Model {
  declare id: CreationOptional<number>;
  declare stock: number;
  declare image: string;
  declare isBest: boolean;
  declare sneakerId: ForeignKey<Sneaker['id']>;
  declare sizeId: ForeignKey<Size['id']>;
  declare colorId: ForeignKey<Color['id']>;
}

export const updateVariantInMongoDB = async (
  variant: Variant,
  sneaker: Sneaker,
) => {
  const color = await Color.findByPk(variant.colorId);
  if (!color) return;
  const sizes = await VariantRepository.findAllSizesForAColorSneaker(
    sneaker.id,
    color.id,
  );
  if (!sizes) return;

  await updateSneakerInMongoDB(sneaker!);

  const data = variant.toJSON();
  data.id = variant.id;
  data.name = color?.name;
  data.slug = `${sneaker?.name}-${color?.name}`;
  data.image = variant.image;
  data.isBest = variant.isBest;
  (data.sizes = await Promise.all(
    sizes.map(async (size) => {
      const variant =
        await VariantRepository.findVariantBySneakerIdAndColorIdAndSizeId(
          data.id,
          color?.id ? color.id : 0,
          size.id,
        );

      return {
        id: size.id,
        name: size.name,
        slug: `${sneaker?.name}-${color?.name}-${size.name}`,
        stock: variant?.stock,
      };
    }),
  )),
    await syncWithMongoDB(Variant.name, 'update', data);
};

export default (sequelize: Sequelize) => {
  Variant.init(
    {
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isBest: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    { sequelize, underscored: true },
  );

  Variant.afterCreate(async (variant) => {
    const sneaker = await Sneaker.findByPk(variant.sneakerId);
    if (!sneaker) return;

    await updateSneakerInMongoDB(sneaker);
  });

  Variant.afterUpdate(async (variant) => {
    const sneaker = await Sneaker.findByPk(variant.sneakerId);
    if (!sneaker) return;

    await updateSneakerInMongoDB(sneaker);
  });

  Variant.afterDestroy(async (variant) => {
    const sneaker = await Sneaker.findByPk(variant.sneakerId);
    if (!sneaker) return;

    await updateSneakerInMongoDB(sneaker!);
  });

  return Variant;
};

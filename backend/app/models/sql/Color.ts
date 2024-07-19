import {
  CreationOptional,
  DataTypes,
  HasManyGetAssociationsMixin,
  Model,
  Sequelize,
} from 'sequelize';
import slugify from 'slugify';
import { Sneaker, updateSneakerInMongoDB } from './Sneaker';
import syncWithMongoDB from '../../helpers/syncPsqlMongo';
import { VariantRepository } from '../../repositories/sql/VariantRepository';
import Variant from './Variant';

export class Color extends Model {
  declare id: CreationOptional<number>;
  declare name: string;
  declare slug: string;
  declare hexCode: string;

  declare getSneakers: HasManyGetAssociationsMixin<Sneaker>;
}

export default (sequelize: Sequelize) => {
  Color.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hexCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { sequelize, underscored: true },
  );

  Color.beforeValidate((color) => {
    if (color.name) {
      color.slug = slugify(color.name, { lower: true });
    }
  });

  Color.afterCreate(async (color) => {
    const data = color.toJSON();
    await syncWithMongoDB(Color.name, 'create', data);
  });

  Color.afterUpdate(async (color) => {
    const data = color.toJSON();
    await syncWithMongoDB(Color.name, 'update', data);

    // Find all variants that have this color
    const variants = await VariantRepository.findAllVariantsByColorId(data.id);

    // Find sneakers associated with variants
    const sneakers = await Promise.all(
      variants.map(async (variant) => {
        return await Sneaker.findByPk(variant.sneakerId);
      }),
    );

    // Update sneakers in MongoDB
    await Promise.all(
      sneakers.map(async (sneaker) => {
        if (sneaker) {
          await updateSneakerInMongoDB(sneaker);
        }
      }),
    );
  });

  Color.afterDestroy(async (color) => {
    const data = color.toJSON();
    await syncWithMongoDB(Color.name, 'delete', data);

    // Find all variants that belong to this color and delete them
    const variants = await VariantRepository.findAllVariantsByColorId(data.id);

    await Promise.all(
      variants.map(async (variant) => {
        const data = variant.toJSON();
        await syncWithMongoDB(Variant.name, 'delete', data);
      }),
    );
  });

  return Color;
};

import {
  CreationOptional,
  DataTypes,
  HasManyGetAssociationsMixin,
  Model,
  Sequelize,
} from 'sequelize';
import slugify from 'slugify';
import { Sneaker } from './Sneaker';
import syncWithMongoDB from '../../helpers/syncPsqlMongo';

export class Size extends Model {
  declare id: CreationOptional<number>;
  declare name: string;
  declare slug: string;

  declare getSneakers: HasManyGetAssociationsMixin<Sneaker>;
}

export default (sequelize: Sequelize) => {
  Size.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    { sequelize, underscored: true },
  );

  Size.beforeValidate((size) => {
    if (size.name) {
      size.slug = slugify(size.name, { lower: true });
    }
  });

  Size.afterCreate(async (size) => {
    const data = size.toJSON();
    await syncWithMongoDB(Size.name, 'create', data);
  });

  Size.afterUpdate(async (size) => {
    const data = size.toJSON();
    await syncWithMongoDB(Size.name, 'update', data);
  });

  Size.afterDestroy(async (size) => {
    const data = size.toJSON();
    await syncWithMongoDB(Size.name, 'delete', data);
  });

  return Size;
};

import {
  CreationOptional,
  DataTypes,
  HasManyGetAssociationsMixin,
  Model,
  Sequelize,
} from 'sequelize';
import { Sneaker } from './Sneaker';
import syncWithMongoDB from '../../helpers/syncPsqlMongo';

export class Category extends Model {
  declare id: CreationOptional<number>;
  declare name: string;
  declare slug: string;
  declare image: string;

  declare getSneakers: HasManyGetAssociationsMixin<Sneaker>;
}

export default (sequelize: Sequelize) => {
  Category.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    { sequelize, underscored: true },
  );

  Category.afterCreate(async (category) => {
    const data = category.toJSON();
    await syncWithMongoDB(Category.name, 'create', data);
  });

  Category.afterUpdate(async (category) => {
    const data = category.toJSON();
    await syncWithMongoDB(Category.name, 'update', data);
  });

  Category.afterDestroy(async (category) => {
    const data = category.toJSON();
    await syncWithMongoDB(Category.name, 'delete', data);
  });

  return Category;
};

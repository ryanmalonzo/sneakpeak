import {
  CreationOptional,
  DataTypes,
  HasManyGetAssociationsMixin,
  Model,
  Sequelize,
} from 'sequelize';
import { Sneaker } from './Sneaker';
import syncWithMongoDB from '../../helpers/syncPsqlMongo';

export class Brand extends Model {
  declare id: CreationOptional<number>;
  declare name: string;
  declare slug: string;

  declare getSneakers: HasManyGetAssociationsMixin<Sneaker>;
}

export default (sequelize: Sequelize) => {
  Brand.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { sequelize, underscored: true },
  );

  Brand.afterCreate(async (brand) => {
    const data = brand.toJSON();
    await syncWithMongoDB(Brand.name, 'create', data);
  });

  Brand.afterUpdate(async (brand) => {
    const data = brand.toJSON();
    await syncWithMongoDB(Brand.name, 'update', data);
  });

  Brand.afterDestroy(async (brand) => {
    const data = brand.toJSON();
    await syncWithMongoDB(Brand.name, 'delete', data);
  });

  return Brand;
};

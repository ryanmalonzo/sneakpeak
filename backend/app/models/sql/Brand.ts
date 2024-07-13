import {
  CreationOptional,
  DataTypes,
  HasManyGetAssociationsMixin,
  Model,
  Sequelize,
} from 'sequelize';
import { Sneaker, updateSneakerInMongoDB } from './Sneaker';
import syncWithMongoDB from '../../helpers/syncPsqlMongo';
import { SneakerRepository } from '../../repositories/sql/SneakerRepository';

export class Brand extends Model {
  declare id: CreationOptional<number>;
  declare name: string;
  declare slug: string;
  declare image: string;

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
      image: {
        type: DataTypes.TEXT,
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

    // Find all sneakers that belong to this brand and update them
    const sneakers = await SneakerRepository.findAllSneakersByBrandId(data.id);

    await Promise.all(
      sneakers.map(async (sneaker) => {
        await updateSneakerInMongoDB(sneaker);
      }),
    );
  });

  Brand.afterDestroy(async (brand) => {
    const data = brand.toJSON();
    await syncWithMongoDB(Brand.name, 'delete', data);
  });

  return Brand;
};

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
import { SneakerRepository } from '../../repositories/sql/SneakerRepository';

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
        unique: true,
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    { sequelize, underscored: true },
  );

  Category.beforeValidate((category) => {
    if (category.name) {
      category.slug = slugify(category.name, { lower: true });
    }
  });

  Category.afterCreate(async (category) => {
    const data = category.toJSON();
    await syncWithMongoDB(Category.name, 'create', data);
  });

  Category.afterUpdate(async (category) => {
    const data = category.toJSON();
    await syncWithMongoDB(Category.name, 'update', data);

    // Find all sneakers that belong to this category and update them
    const sneakers = await SneakerRepository.findAllSneakersByCategoryId(
      data.id,
    );

    await Promise.all(
      sneakers.map(async (sneaker) => {
        await updateSneakerInMongoDB(sneaker);
      }),
    );
  });

  Category.afterDestroy(async (category) => {
    const data = category.toJSON();
    await syncWithMongoDB(Category.name, 'delete', data);

    // Find all sneakers that belong to this category and delete them
    const sneakers = await SneakerRepository.findAllSneakersByCategoryId(
      data.id,
    );

    await Promise.all(
      sneakers.map(async (sneaker) => {
        const data = sneaker.toJSON();
        await syncWithMongoDB(Sneaker.name, 'delete', data);
      }),
    );
  });

  return Category;
};

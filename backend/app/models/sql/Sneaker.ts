import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  Model,
  Sequelize,
} from 'sequelize';
import { Category } from './Category';
import { Brand } from './Brand';
import syncWithMongoDB from '../../helpers/syncPsqlMongo';
import { BrandRepository } from '../../repositories/sql/BrandRepository';
import { CategoryRepository } from '../../repositories/sql/CategoryRepository';
import { VariantRepository } from '../../repositories/sql/VariantRepository';

export class Sneaker extends Model {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: string;
  declare price: number;
  declare categoryId: ForeignKey<Category['id']>;
  declare brandId: ForeignKey<Brand['id']>;
}

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
    console.log('Creating a new document:', sneaker);
    const data = sneaker.toJSON();
    const variants = await VariantRepository.findVariantsBySneakerId(data.id);
    const category = await CategoryRepository.findCategoryById(
      data.category_id,
    );
    const brand = await BrandRepository.findBrandById(data.brand_id);
    data.category = category;
    data.brand = brand;
    data.variants = variants;
    await syncWithMongoDB(sneaker.constructor.name, 'create', data);
  });

  Sneaker.afterUpdate(async (sneaker) => {
    console.log('Updating a document:', sneaker);
    const data = sneaker.toJSON();
    const variants = await VariantRepository.findVariantsBySneakerId(data.id);
    const category = await CategoryRepository.findCategoryById(
      data.category_id,
    );
    const brand = await BrandRepository.findBrandById(data.brand_id);
    data.category = category;
    data.brand = brand;
    data.variants = variants;
    await syncWithMongoDB(sneaker.constructor.name, 'update', data);
  });

  Sneaker.afterDestroy(async (sneaker) => {
    console.log('Deleting a document:', sneaker);
    const data = sneaker.toJSON();
    await syncWithMongoDB(sneaker.constructor.name, 'delete', data);
  });
  return Sneaker;
};

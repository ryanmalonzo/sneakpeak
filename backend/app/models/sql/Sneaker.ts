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
import { SizeRepository } from '../../repositories/sql/SizeRepository';
import { ColorRepository } from '../../repositories/sql/ColorRepository';

export class Sneaker extends Model {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: string;
  declare mainCover: string;
  declare price: number;
  declare categoryId: ForeignKey<Category['id']>;
  declare brandId: ForeignKey<Brand['id']>;
}

export const updateSneakerInMongoDB = async (sneaker: Sneaker) => {
  console.log('Updating a document:', sneaker);
  const data = sneaker.toJSON();
  const variants = await VariantRepository.findVariantsBySneakerId(data.id);
  const category = await CategoryRepository.findCategoryById(data.categoryId);
  const brand = await BrandRepository.findBrandById(data.brandId);

  data.category = category!.name;
  data.brand = brand!.name;

  data.variants = await Promise.all(
    variants.map(async (variant) => {
      const size = await SizeRepository.findSizeById(variant.sizeId);
      const color = await ColorRepository.findColorById(variant.colorId);

      return {
        stock: variant.stock,
        image: variant.image,
        size: size!.name,
        color: color!.name,
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
      mainCover: {
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
    const category = await CategoryRepository.findCategoryById(data.categoryId);
    const brand = await BrandRepository.findBrandById(data.brandId);
    data.category = category!.name;
    data.brand = brand!.name;
    data.variants = [];
    await syncWithMongoDB(sneaker.constructor.name, 'create', data);
  });

  Sneaker.afterUpdate(updateSneakerInMongoDB);

  Sneaker.afterDestroy(async (sneaker) => {
    console.log('Deleting a document:', sneaker);
    const data = sneaker.toJSON();
    await syncWithMongoDB(sneaker.constructor.name, 'delete', data);
  });
  return Sneaker;
};

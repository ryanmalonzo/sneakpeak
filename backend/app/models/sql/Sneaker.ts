import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  Model,
  Sequelize,
} from 'sequelize';
import { Category } from './Category';
import { Brand } from './Brand';

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

  return Sneaker;
};

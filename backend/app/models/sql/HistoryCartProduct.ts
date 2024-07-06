import {
  CreationOptional,
  DataTypes,
  Model,
  Sequelize,
  ForeignKey,
} from 'sequelize';

import { Cart } from './Cart';
import { Variant } from './Variant';

export class HistoryCartProduct extends Model {
  declare id: CreationOptional<number>;
  declare cartId: ForeignKey<Cart['id']>;
  declare variantId: ForeignKey<Variant['id']>;
  declare quantity: number;
  declare unitPrice: number;
  declare name: string;
  declare image: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export default (sequelize: Sequelize) => {
  HistoryCartProduct.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      unitPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    { sequelize, underscored: true },
  );
};

import {
  CreationOptional,
  DataTypes,
  Model,
  Sequelize,
  ForeignKey,
} from 'sequelize';
import { Order } from './Order';
import { Variant } from './Variant';

export class OrderProduct extends Model {
  declare id: CreationOptional<number>;
  declare orderId: ForeignKey<Order['id']>;
  declare variantId: ForeignKey<Variant['id']>;
  declare name: string;
  declare image: string;
  declare unitPrice: number;
  declare quantity: number;
}

export default (sequelize: Sequelize) => {
  OrderProduct.init(
    {
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      variantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    { sequelize, underscored: true },
  );
};

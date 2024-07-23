import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  Model,
  Sequelize,
} from 'sequelize';

import { Order } from './Order';
import syncWithMongoDB from '../../helpers/syncPsqlMongo';
export class OrderAddress extends Model {
  declare id: CreationOptional<number>;
  declare type: string;
  declare postal_code: string;
  declare street: string;
  declare city: string;
  declare phone: string;
  declare name: string;
  declare orderId: ForeignKey<Order['id']>;
}

export default (sequelize: Sequelize) => {
  OrderAddress.init(
    {
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postal_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      street: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { sequelize, underscored: true },
  );

  OrderAddress.afterCreate(async (orderAddress) => {
    const order = await Order.findByPk(orderAddress.orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    await syncWithMongoDB(Order.name, 'update', order.toJSON());
  });

  OrderAddress.afterUpdate(async (orderAddress) => {
    const order = await Order.findByPk(orderAddress.orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    await syncWithMongoDB(Order.name, 'update', order.toJSON());
  });

  OrderAddress.afterDestroy(async (orderAddress) => {
    const order = await Order.findByPk(orderAddress.orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    await syncWithMongoDB(Order.name, 'update', order.toJSON());
  });

  return OrderAddress;
};

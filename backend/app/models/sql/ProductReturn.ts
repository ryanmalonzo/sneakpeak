import {
  CreationOptional,
  DataTypes,
  Model,
  Sequelize,
  ForeignKey,
} from 'sequelize';
import { OrderProduct } from './OrderProduct';
import { SyncOrderInMongoDB } from './Order';
import { OrderRepository } from '../../repositories/sql/OrderRepository';

export class ProductReturn extends Model {
  declare id: CreationOptional<number>;
  declare order_products_id: ForeignKey<OrderProduct['id']>;
  declare reason: string;
  declare status: string;
}

export default (sequelize: Sequelize) => {
  ProductReturn.init(
    {
      order_products_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: OrderProduct,
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
      },
    },
    {
      sequelize,
      underscored: true,
      timestamps: true,
    },
  );

  ProductReturn.afterCreate(async (productReturn) => {
    const data = productReturn.toJSON();
    const orderProduct = await OrderProduct.findOne({
      where: { id: data.order_products_id },
    });
    if (!orderProduct) {
      return;
    }

    const order = await OrderRepository.findById(orderProduct.orderId);
    if (!order) {
      return;
    }
    await SyncOrderInMongoDB(order, 'update');
  });

  ProductReturn.afterUpdate(async (productReturn) => {
    const data = productReturn.toJSON();
    const orderProduct = await OrderProduct.findOne({
      where: { id: data.order_products_id },
    });
    if (!orderProduct) {
      return;
    }

    const order = await OrderRepository.findById(orderProduct.orderId);
    if (!order) {
      return;
    }
    await SyncOrderInMongoDB(order, 'update');
  });

  return ProductReturn;
};

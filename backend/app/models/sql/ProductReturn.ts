import {
  CreationOptional,
  DataTypes,
  Model,
  Sequelize,
  ForeignKey,
} from 'sequelize';
import { OrderProduct } from './OrderProduct';

export class ProductReturn extends Model {
  declare id: CreationOptional<number>;
  declare orderProductId: ForeignKey<OrderProduct['id']>;
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
};

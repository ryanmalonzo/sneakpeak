import {
  CreationOptional,
  DataTypes,
  Model,
  Sequelize,
  ForeignKey,
} from 'sequelize';
import { User } from './User';

export class Order extends Model {
  declare id: CreationOptional<number>;
  declare total: number;
  declare status: string;
  declare payment_status: string;
  declare reference: string;
  declare session_id: string;
  declare invoice_link: string;
  declare userId: ForeignKey<User['id']>;
  declare createdAt: Date;
}

export default (sequelize: Sequelize) => {
  Order.init(
    {
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      payment_status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reference: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      session_id: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      invoice_link: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    { sequelize, underscored: true },
  );
};

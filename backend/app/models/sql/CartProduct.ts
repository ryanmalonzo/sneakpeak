import { CreationOptional, DataTypes, Model, Sequelize } from 'sequelize';

export class CartProduct extends Model {
  declare id: CreationOptional<number>;
  declare cart_id: number;
  declare variant_id: number;
  declare quantity: number;
  declare total: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export default (sequelize: Sequelize) => {
  CartProduct.init(
    {
      cart_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      variant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
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

  return CartProduct;
};

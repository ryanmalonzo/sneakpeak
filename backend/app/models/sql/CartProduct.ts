import {
  CreationOptional,
  DataTypes,
  Model,
  Sequelize,
  HasManyGetAssociationsMixin,
  ForeignKey,
  Association,
} from 'sequelize';
import { Cart } from './Cart';
import { SyncCartInMongoDB } from '../../models/sql/Cart';
import { Variant } from './Variant';

export class CartProduct extends Model {
  declare id: CreationOptional<number>;
  declare cartId: ForeignKey<Cart['id']>;
  declare variantId: ForeignKey<Variant['id']>;
  declare quantity: number;
  declare unitPrice: number;
  declare name: string;
  declare image: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare getCart: HasManyGetAssociationsMixin<Cart>;

  static associations: {
    cart: Association<CartProduct, Cart>;
  };
}

export default (sequelize: Sequelize) => {
  CartProduct.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.TEXT('long'),
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

  CartProduct.afterCreate(async (cartProduct) => {
    const data = cartProduct.toJSON();
    const cart = await Cart.findByPk(data.cartId);
    await SyncCartInMongoDB(cart!, 'update');
  });

  CartProduct.afterUpdate(async (cartProduct) => {
    const data = cartProduct.toJSON();
    const cart = await Cart.findByPk(data.cartId);
    await SyncCartInMongoDB(cart!, 'update');
  });

  CartProduct.afterDestroy(async (cartProduct) => {
    const data = cartProduct.toJSON();
    const cart = await Cart.findByPk(data.cartId);
    await SyncCartInMongoDB(cart!, 'update');
  });

  return CartProduct;
};

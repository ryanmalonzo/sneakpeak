import {
  CreationOptional,
  DataTypes,
  Model,
  Sequelize,
  HasManyGetAssociationsMixin,
  ForeignKey,
} from 'sequelize';
import syncWithMongoDB from '../../helpers/syncPsqlMongo';
import { CartProductRepository } from '../../repositories/sql/CartProductRepository';
import { UserRepository } from '../../repositories/sql/UserRepository';
import { VariantRepository } from '../../repositories/sql/VariantRepository';
import { CategoryRepository } from '../../repositories/sql/CategoryRepository';
import { BrandRepository } from '../../repositories/sql/BrandRepository';
import { SneakerRepository } from '../../repositories/sql/SneakerRepository';
import { ColorRepository } from '../../repositories/sql/ColorRepository';
import { SizeRepository } from '../../repositories/sql/SizeRepository';
import { CartProduct } from './CartProduct';
import { Operation } from '../../helpers/syncPsqlMongo';
import { User } from './User';

export const SyncCartInMongoDB = async (Cart: Cart, type: Operation) => {
  try {
    const data = Cart.toJSON();
    const [items, user] = await Promise.all([
      CartProductRepository.findCartProductsByCartId(data.id),
      UserRepository.findById(data.userId),
    ]);

    data.user = user!.id;

    const cartProductPromises = items.map(async (item: CartProduct) => {
      const variant = await VariantRepository.findVariantById(item.variantId);
      if (!variant) {
        throw new Error(`Variant not found for id ${item.variantId}`);
      }

      const sneaker = await SneakerRepository.findSneakerById(
        variant.sneakerId,
      );
      if (!sneaker) {
        throw new Error(`Sneaker not found for id ${variant.sneakerId}`);
      }

      const [category, brand] = await Promise.all([
        CategoryRepository.findCategoryById(sneaker.categoryId),
        BrandRepository.findBrandById(sneaker.brandId),
      ]);

      const [color, size] = await Promise.all([
        ColorRepository.findColorById(variant.colorId),
        SizeRepository.findSizeById(variant.sizeId),
      ]);

      if (!color) {
        throw new Error(`Color not found for id ${variant.colorId}`);
      }
      if (!size) {
        throw new Error(`Size not found for id ${variant.sizeId}`);
      }

      if (!category) {
        throw new Error(`Category not found for id ${sneaker.categoryId}`);
      }

      if (!brand) {
        throw new Error(`Brand not found for id ${sneaker.brandId}`);
      }

      return {
        id: variant.id,
        reference: sneaker.name,
        name: sneaker.name,
        color: color.name,
        size: size.name,
        category: category.name,
        brand: brand.name,
        image: variant.image,
        quantity: item.quantity,
        stock: variant.stock,
        unitPrice: sneaker.price,
        adjustment: 0,
        total: item.quantity * sneaker.price,
      };
    });

    data.cartProduct = await Promise.all(cartProductPromises);
    data.totalCart = data.cartProduct.reduce((total: number) => total, 0);
    data.modifiedAt = new Date();
    data.expiredAt = new Date(new Date().getTime() + 15 * 60 * 1000); // 15 minutes from now

    await syncWithMongoDB(Cart.constructor.name, type, data);
  } catch (error) {
    console.error('Error syncing cart with MongoDB:', error);
  }
};

export class Cart extends Model {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User['id']>;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare expiredAt: Date;

  declare getCartProducts: HasManyGetAssociationsMixin<CartProduct>;
}

export default (sequelize: Sequelize) => {
  Cart.init(
    {
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      expiredAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    { sequelize, underscored: true },
  );

  Cart.afterCreate(async (cart) => {
    SyncCartInMongoDB(cart, 'create');
  });

  Cart.afterUpdate(async (cart) => {
    SyncCartInMongoDB(cart, 'update');
  });

  Cart.afterDestroy(async (cart) => {
    const data = cart.toJSON();
    await syncWithMongoDB(Cart.name, 'delete', data);
  });

  return Cart;
};

import {
  CreationOptional,
  DataTypes,
  Model,
  Sequelize,
  ForeignKey,
} from 'sequelize';
import { User } from './User';

import { OrderProduct } from './OrderProduct';
import { UserRepository } from '../../repositories/sql/UserRepository';
import { VariantRepository } from '../../repositories/sql/VariantRepository';
import { SneakerRepository } from '../../repositories/sql/SneakerRepository';
import { CategoryRepository } from '../../repositories/sql/CategoryRepository';
import { BrandRepository } from '../../repositories/sql/BrandRepository';
import { ColorRepository } from '../../repositories/sql/ColorRepository';
import { SizeRepository } from '../../repositories/sql/SizeRepository';
import { OrderProductRepository } from '../../repositories/sql/OrderProductRepository';
import { OrderRepository } from '../../repositories/sql/OrderRepository';
import { Operation } from '../../helpers/syncPsqlMongo';
import syncWithMongoDB from '../../helpers/syncPsqlMongo';

export const SyncOrderInMongoDB = async (Order: Order, type: Operation) => {
  try {
    const data = Order.toJSON();
    console.log('SyncOrderInMongoDB', data);
    const user = await UserRepository.findById(data.userId);
    const shipping = await OrderRepository.findAddressByType(
      data.id,
      'shipping',
    );
    const billing = await OrderRepository.findAddressByType(data.id, 'billing');

    if (shipping) {
      data.shipping = shipping.toJSON();
    }
    if (billing) {
      data.billing = billing.toJSON();
    }

    if (!user) {
      throw new Error(`User not found for id ${data.userId}`);
    }

    data.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const items = await OrderProductRepository.findByOrderId(data.id);

    const orderProductPromises = items.map(async (item: OrderProduct) => {
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
        ...item.toJSON(),
        variant: variant.toJSON(),
        sneaker: sneaker.toJSON(),
        category: category.name,
        brand: brand.name,
        color: color.name,
        size: size.name,
      };
    });

    await Promise.all(orderProductPromises);

    data.orderProduct = items.map((item) => item.toJSON());

    await syncWithMongoDB(Order.constructor.name, type, data);
  } catch (error) {
    console.error(error);
  }
};

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

  Order.afterCreate(async (order) => {
    await SyncOrderInMongoDB(order, 'create');
  });

  Order.afterUpdate(async (order) => {
    await SyncOrderInMongoDB(order, 'update');
  });

  Order.afterDestroy(async (order) => {
    const data = order.toJSON();
    await syncWithMongoDB(Order.name, 'delete', data);
  });
};

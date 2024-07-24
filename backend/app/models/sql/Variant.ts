import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  Model,
  Sequelize,
} from 'sequelize';
import { Sneaker, updateSneakerInMongoDB } from './Sneaker';
import { Size } from './Size';
import { Color } from './Color';
import { UserRepository } from '../../repositories/sql/UserRepository';
import { PostmarkClient } from '../../helpers/postmark';

export interface VariantDTO {
  stock: number;
  image: string;
  isBest: boolean;
  sneakerId: number;
  sizeId: number;
  colorId: number;
}

export class Variant extends Model {
  declare id: CreationOptional<number>;
  declare stock: number;
  declare image: string;
  declare isBest: boolean;
  declare sneakerId: ForeignKey<Sneaker['id']>;
  declare sizeId: ForeignKey<Size['id']>;
  declare colorId: ForeignKey<Color['id']>;
}

const STOCK_MAX = 10;
const TEMPLATE_ID_LOW_STOCK = 36711455;

export default (sequelize: Sequelize) => {
  Variant.init(
    {
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isBest: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    { sequelize, underscored: true },
  );

  Variant.afterCreate(async (variant) => {
    const sneaker = await Sneaker.findByPk(variant.sneakerId);
    if (!sneaker) return;

    await updateSneakerInMongoDB(sneaker);
  });

  Variant.afterUpdate(async (variant) => {
    const sneaker = await Sneaker.findByPk(variant.sneakerId);
    if (!sneaker) return;
    if (variant.stock < STOCK_MAX) {
      const users = await UserRepository.findByRole('STORE_KEEPER');
      if (!users) return;
      const sneaker = await Sneaker.findByPk(variant.sneakerId);
      if (!sneaker) return;
      const color = await Color.findByPk(variant.colorId);
      if (!color) return;
      const size = await Size.findByPk(variant.sizeId);
      if (!size) return;
      const url = `${process.env.WEBAPP_URL}/admin/variants/${variant.id}`;
      users.forEach(async (user) => {
        await PostmarkClient.sendEmail(user.email, TEMPLATE_ID_LOW_STOCK, {
          sneaker: sneaker.name,
          url: url,
          color: color.name,
          size: size.name,
        });
      });
    }

    await updateSneakerInMongoDB(sneaker);
  });

  Variant.afterDestroy(async (variant) => {
    const sneaker = await Sneaker.findByPk(variant.sneakerId);
    if (!sneaker) return;

    await updateSneakerInMongoDB(sneaker!);
  });

  return Variant;
};

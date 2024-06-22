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
import syncWithMongoDB from '../../helpers/syncPsqlMongo';

export class Variant extends Model {
  declare id: CreationOptional<number>;
  declare stock: number;
  declare image: string;
  declare sneakerId: ForeignKey<Sneaker['id']>;
  declare sizeId: ForeignKey<Size['id']>;
  declare colorId: ForeignKey<Color['id']>;
}

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
    },
    { sequelize, underscored: true },
  );

  Variant.afterCreate(async (variant) => {
    const sneaker = await Sneaker.findByPk(variant.sneakerId);
    const size = await Size.findByPk(variant.sizeId);
    const color = await Color.findByPk(variant.colorId);

    await updateSneakerInMongoDB(sneaker!);

    const data = variant.toJSON();
    data.name = sneaker!.name;
    data.price = sneaker!.price;
    data.size = size!.name;
    data.color = color!.name;
    await syncWithMongoDB(Variant.name, 'create', data);
  });

  Variant.afterUpdate(async (variant) => {
    const sneaker = await Sneaker.findByPk(variant.sneakerId);
    const size = await Size.findByPk(variant.sizeId);
    const color = await Color.findByPk(variant.colorId);

    await updateSneakerInMongoDB(sneaker!);

    const data = variant.toJSON();
    data.name = sneaker!.name;
    data.price = sneaker!.price;
    data.size = size!.name;
    data.color = color!.name;
    await syncWithMongoDB(Variant.name, 'update', data);
  });

  Variant.afterDestroy(async (variant) => {
    const sneaker = await Sneaker.findByPk(variant.sneakerId);
    await updateSneakerInMongoDB(sneaker!);

    const data = variant.toJSON();
    await syncWithMongoDB(Variant.name, 'delete', data);
  });

  return Variant;
};

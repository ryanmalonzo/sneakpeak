import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  Model,
  Sequelize,
} from 'sequelize';
import { Sneaker } from './Sneaker';
import { Size } from './Size';
import { Color } from './Color';

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
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { sequelize, underscored: true },
  );

  return Variant;
};

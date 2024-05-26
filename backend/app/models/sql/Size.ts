import {
  CreationOptional,
  DataTypes,
  HasManyGetAssociationsMixin,
  Model,
  Sequelize,
} from 'sequelize';
import { Sneaker } from './Sneaker';

export class Size extends Model {
  declare id: CreationOptional<number>;
  declare name: string;
  declare slug: string;

  declare getSneakers: HasManyGetAssociationsMixin<Sneaker>;
}

export default (sequelize: Sequelize) => {
  Size.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { sequelize, underscored: true },
  );

  return Size;
};

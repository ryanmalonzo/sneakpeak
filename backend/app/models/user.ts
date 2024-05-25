import { DataTypes, Model } from 'sequelize';
import { sequelize } from '.';

export class User extends Model {
  declare email: string;
  declare password: string;
  declare firstName: string;
  declare lastName: string;
  declare phone: string;
}

User.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize, underscored: true },
);

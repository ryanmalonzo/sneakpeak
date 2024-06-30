import {
  CreationOptional,
  DataTypes,
  HasManyGetAssociationsMixin,
  Model,
  Sequelize,
} from 'sequelize';
import { Challenge } from './Challenge';

export class User extends Model {
  declare id: CreationOptional<number>;
  declare email: string;
  declare password: string;
  declare firstName: string;
  declare lastName: string;
  declare phone: string;
  declare roles: string[];

  declare getChallenges: HasManyGetAssociationsMixin<Challenge>;
}

export default (sequelize: Sequelize) => {
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      roles: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: ['USER'],
      },
    },
    { sequelize, underscored: true },
  );

  return User;
};

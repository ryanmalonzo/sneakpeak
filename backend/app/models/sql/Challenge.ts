import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  Model,
  Sequelize,
} from 'sequelize';
import { User } from './User';

export class Challenge extends Model {
  declare id: CreationOptional<number>;
  declare token: string;
  declare type: string;
  declare expiresAt: Date;
  declare disabled: boolean;
  declare userId: ForeignKey<User['id']>;
}

export default (sequelize: Sequelize) => {
  Challenge.init(
    {
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        values: ['email', 'password-reset'],
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      disabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    { sequelize, underscored: true },
  );

  return Challenge;
};

import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  Model,
  Sequelize,
} from 'sequelize';
import { User } from './user';

export class Challenge extends Model {
  declare id: CreationOptional<number>;
  declare token: string;
  declare type: string;
  declare expiresAt: Date;
  declare verified: boolean;
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
      verified: {
        type: DataTypes.BOOLEAN,
      },
    },
    { sequelize, underscored: true },
  );

  return Challenge;
};

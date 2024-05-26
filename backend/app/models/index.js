import { Sequelize } from 'sequelize';
import user from './user';
import challenge from './challenge';

export const sequelize = new Sequelize(process.env.DATABASE_URL);

export const User = user(sequelize);
export const Challenge = challenge(sequelize);

User.hasMany(Challenge);

Challenge.belongsTo(User, {
  onDelete: 'CASCADE',
  foreignKey: {
    name: 'userId',
    allowNull: false,
  },
});

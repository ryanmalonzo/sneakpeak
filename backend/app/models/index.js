import { Sequelize } from 'sequelize';
import user, { User } from './sql/User';
import challenge, { Challenge } from './sql/Challenge';
import sneaker, { Sneaker } from './sql/Sneaker';
import category, { Category } from './sql/Category';
import brand, { Brand } from './sql/Brand';
import color, { Color } from './sql/Color';
import size, { Size } from './sql/Size';
import variant, { Variant } from './sql/Variant';

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: process.env.NODE_ENV !== 'test',
});

user(sequelize);
challenge(sequelize);
sneaker(sequelize);
category(sequelize);
brand(sequelize);
color(sequelize);
size(sequelize);
variant(sequelize);

User.hasMany(Challenge);

Challenge.belongsTo(User, {
  onDelete: 'CASCADE',
  foreignKey: {
    name: 'userId',
    allowNull: false,
  },
});

Category.hasMany(Sneaker);
Sneaker.belongsTo(Category, {
  onDelete: 'CASCADE',
  foreignKey: {
    name: 'categoryId',
    allowNull: false,
  },
});

Brand.hasMany(Sneaker);
Sneaker.belongsTo(Brand, {
  onDelete: 'CASCADE',
  foreignKey: {
    name: 'brandId',
    allowNull: false,
  },
});

Sneaker.hasMany(Variant);
Variant.belongsTo(Sneaker, {
  onDelete: 'CASCADE',
  foreignKey: {
    name: 'sneakerId',
    allowNull: false,
  },
});

Color.hasMany(Variant);
Variant.belongsTo(Color, {
  onDelete: 'CASCADE',
  foreignKey: {
    name: 'colorId',
    allowNull: false,
  },
});

Size.hasMany(Variant);
Variant.belongsTo(Size, {
  onDelete: 'CASCADE',
  foreignKey: {
    name: 'sizeId',
    allowNull: false,
  },
});

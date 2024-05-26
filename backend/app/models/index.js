import { Sequelize } from 'sequelize';
import user, { User } from './user';
import challenge, { Challenge } from './challenge';
import sneaker, { Sneaker } from './sneaker';
import category, { Category } from './category';
import brand, { Brand } from './brand';
import color, { Color } from './brand';
import size, { Size } from './brand';
import variant, { Variant } from './variant';

export const sequelize = new Sequelize(process.env.DATABASE_URL);

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
Sneaker.hasOne(Category);

Brand.hasMany(Sneaker);
Sneaker.hasOne(Brand);

Sneaker.hasMany(Variant);
Variant.hasOne(Sneaker);

Color.hasMany(Variant);
Variant.hasOne(Color);

Size.hasMany(Variant);
Variant.hasOne(Size);

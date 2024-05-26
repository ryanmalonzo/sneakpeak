import { Sequelize } from 'sequelize';
import user, { User } from './User';
import challenge, { Challenge } from './Challenge';
import sneaker, { Sneaker } from './Sneaker';
import category, { Category } from './Category';
import brand, { Brand } from './Brand';
import color, { Color } from './Brand';
import size, { Size } from './Brand';
import variant, { Variant } from './Variant';

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

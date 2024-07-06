import { Sequelize } from 'sequelize';
import user, { User } from './sql/User';
import challenge, { Challenge } from './sql/Challenge';
import sneaker, { Sneaker } from './sql/Sneaker';
import category, { Category } from './sql/Category';
import brand, { Brand } from './sql/Brand';
import color, { Color } from './sql/Color';
import size, { Size } from './sql/Size';
import variant, { Variant } from './sql/Variant';
import cart, { Cart } from './sql/Cart';
import cartProduct, { CartProduct } from './sql/CartProduct';
import orderAdress, { OrderAddress } from './sql/OrderAddress';
import order, { Order } from './sql/Order';
import orderProduct, { OrderProduct } from './sql/OrderProduct';
import historyCartProduct, { HistoryCartProduct } from './sql/HistoryCartProduct';


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
cart(sequelize);
cartProduct(sequelize);
order(sequelize);
orderAdress(sequelize);
orderProduct(sequelize);
historyCartProduct(sequelize);

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

Cart.hasMany(CartProduct);
Cart.hasMany(HistoryCartProduct);

Cart.belongsTo(User, {
  onDelete: 'CASCADE',
  foreignKey: {
    name: 'userId',
    allowNull: false,
  },
});

CartProduct.belongsTo(Variant, {
  onDelete: 'CASCADE',
  foreignKey: {
    name: 'variantId',
    allowNull: false,
  },
});

CartProduct.belongsTo(Cart, {
  onDelete: 'CASCADE',
  foreignKey: {
    name: 'cartId',
    allowNull: false,
  },
});

HistoryCartProduct.belongsTo(Variant, {
  onDelete: 'CASCADE',
  foreignKey: {
    name: 'variantId',
    allowNull: false,
  },
});

HistoryCartProduct.belongsTo(Cart, {
  onDelete: 'CASCADE',
  foreignKey: {
    name: 'cartId',
    allowNull: false,
  },
});

Order.hasMany(OrderAddress);

OrderAddress.belongsTo(Order, {
  onDelete: 'CASCADE',
  foreignKey: {
    name: 'orderId',
    allowNull: false,
  },
});

Order.belongsTo(User, {
  onDelete: 'CASCADE',
  foreignKey: {
    name: 'userId',
    allowNull: false,
  },
});

OrderProduct.belongsTo(Order, {
  onDelete: 'CASCADE',
  foreignKey: {
    name: 'orderId',
    allowNull: false,
  },
});

OrderProduct.belongsTo(Variant, {
  onDelete: 'CASCADE',
  foreignKey: {
    name: 'variantId',
    allowNull: false,
  },
});


export default sequelize;

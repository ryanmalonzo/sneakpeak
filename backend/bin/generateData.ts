import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { BuildOptions, Model } from 'sequelize';
import { Brand } from '../app/models/sql/Brand';
import { Category } from '../app/models/sql/Category';
import { Challenge } from '../app/models/sql/Challenge';
import { Color } from '../app/models/sql/Color';
import { Size } from '../app/models/sql/Size';
import { Sneaker } from '../app/models/sql/Sneaker';
import { User } from '../app/models/sql/User';
import { Variant } from '../app/models/sql/Variant';
import { SALT_ROUNDS } from '../app/services/UserService';
import { imageUrlToBase64 } from '../app/helpers/images';

dotenv.config();

const { sequelize } = require('../app/models');
sequelize.options.logging = false;

async function connect(): Promise<void> {
  try {
    mongoose
      .connect(process.env.MONGODB_URI!, { dbName: 'sneakpeak' })
      .then(() => {
        console.log('MongoDB connected');
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (error) {
    console.error('Error connecting to MongoDB: ', error);
  }

  try {
    await sequelize.sync({ alter: true });
    await generateData(process.argv[2], process.argv[3], process.argv[4]);
    await sequelize.close();
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error connecting to PostgreSQL: ', error);
  }
}
connect();

// model: le nom du modèle pour lequel on veut générer des données
// isDelete: true si on veut supprimer les données existantes avant de générer de nouvelles données
// count: le nombre de données à générer
async function generateData(model: string, isDelete: string, count: string) {
  switch (model.toLowerCase()) {
    case 'user':
      await generateDataModelUser(isDelete === 'true', parseInt(count));
      console.log('Data generated for User model');
      break;
    case 'sneaker':
      await generateDataModelSneaker(isDelete === 'true', parseInt(count));
      console.log('Data generated for Sneaker model');
      break;
    case 'category':
      await generateDataModelCategory(isDelete === 'true', parseInt(count));
      console.log('Data generated for Category model');
      break;
    case 'brand':
      await generateDataModelBrand(isDelete === 'true', parseInt(count));
      console.log('Data generated for Brand model');
      break;
    case 'color':
      await generateDataModelColor(isDelete === 'true', parseInt(count));
      console.log('Data generated for Color model');
      break;
    case 'size':
      await generateDataModelSize(isDelete === 'true', parseInt(count));
      console.log('Data generated for Size model');
      break;
    case 'variant':
      await generateDataModelVariant(isDelete === 'true', parseInt(count));
      console.log('Data generated for Variant model');
      break;
    case 'all':
      await generateDataModelUser(isDelete === 'true', parseInt(count));
      await generateDataModelVariant(isDelete === 'true', parseInt(count));
      console.log('Data generated for all models');
      break;
    default:
      return console.log('Model not found');
  }
}

type GenericModel = typeof Model &
  (new (values?: object, options?: BuildOptions) => Model);

async function generateDataModel(
  model: GenericModel,
  mongoModelName: string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  data: Function,
  isDelete: boolean,
  count: number,
): Promise<void> {
  if (isDelete) {
    await mongoose.connection.db.dropCollection(mongoModelName);
    await model.truncate({ cascade: true, restartIdentity: true });
  }

  for (let i = 0; i < count; i++) {
    await model.create(await data());
  }

  console.log(`Created ${count} ${model.name} models`);
}

async function generateDataModelUser(
  isDelete: boolean = false,
  count: number = 10,
): Promise<void> {
  if (isDelete) {
    await User.truncate({ cascade: true, restartIdentity: true });
  }

  for (let i = 0; i < count; i++) {
    const user = await User.create({
      email: faker.internet.email(),
      password: await bcrypt.hash('sneakpeak', SALT_ROUNDS),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phone: faker.phone.number(),
    });

    await Challenge.create({
      type: 'email',
      token: faker.string.alphanumeric(32),
      expiresAt: faker.date.future(),
      disabled: true,
      userId: user.id,
    });
  }

  console.log(`Created ${count} User models`);
}

async function generateDataModelBrand(
  isDelete: boolean = false,
  count: number = 10,
): Promise<void> {
  await generateDataModel(
    Brand as GenericModel,
    'brands',
    async () => ({
      name: faker.company.name(),
      image: await imageUrlToBase64(
        faker.image.urlLoremFlickr({ category: 'logo' }),
      ),
    }),
    isDelete,
    count,
  );
}

async function generateDataModelCategory(
  isDelete: boolean = false,
  count: number = 10,
): Promise<void> {
  await generateDataModel(
    Category as GenericModel,
    'categories',
    async () => ({
      name: faker.lorem.word(),
      image: await imageUrlToBase64(
        faker.image.urlLoremFlickr({ category: 'sneaker' }),
      ),
    }),
    isDelete,
    count,
  );
}

async function generateDataModelColor(
  isDelete: boolean = false,
  count: number = 10,
): Promise<void> {
  await generateDataModel(
    Color as GenericModel,
    'colors',
    () => ({
      name: faker.color.human(),
      hexCode: faker.internet.color(),
    }),
    isDelete,
    count,
  );
}

async function generateDataModelSize(
  isDelete: boolean = false,
  count: number = 10,
): Promise<void> {
  await generateDataModel(
    Size as GenericModel,
    'sizes',
    () => ({
      name: `${faker.number.int({ min: 35, max: 48 })}`,
    }),
    isDelete,
    count,
  );
}

async function generateDataModelSneaker(
  isDelete: boolean = false,
  count: number = 10,
): Promise<void> {
  if (isDelete) {
    await mongoose.connection.db.dropCollection('sneakers');
    await Sneaker.truncate({ cascade: true, restartIdentity: true });
  }

  await Promise.all([
    generateDataModelCategory(isDelete, count),
    generateDataModelBrand(isDelete, count),
  ]);

  for (let i = 0; i < count; i++) {
    await Sneaker.create({
      name: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      price: faker.number.float({ min: 50, max: 300, multipleOf: 0.1 }),
      categoryId: (await Category.findOne({ order: sequelize.random() }))!.id,
      brandId: (await Brand.findOne({ order: sequelize.random() }))!.id,
    });
  }

  console.log(`Created ${count} Sneaker models`);
}

async function generateDataModelVariant(
  isDelete: boolean = false,
  count: number = 10,
): Promise<void> {
  if (isDelete) {
    await mongoose.connection.db.dropCollection('variants');
    await Variant.truncate({ cascade: true, restartIdentity: true });
  }

  await Promise.all([
    generateDataModelColor(isDelete, count),
    generateDataModelSize(isDelete, count),
    generateDataModelSneaker(isDelete, count),
  ]);

  for (let i = 0; i < count; i++) {
    await Variant.create({
      stock: faker.number.int({ min: 0, max: 200 }),
      image: await imageUrlToBase64(
        faker.image.urlLoremFlickr({ category: 'sneaker' }),
      ),
      isBest: faker.datatype.boolean({ probability: 0.1 }),
      sneakerId: (await Sneaker.findOne({ order: sequelize.random() }))!.id,
      sizeId: (await Size.findOne({ order: sequelize.random() }))!.id,
      colorId: (await Color.findOne({ order: sequelize.random() }))!.id,
    });
  }

  console.log(`Created ${count} Variant models`);
}

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { UserService } from '../services/user';
import { CategoryService } from '../services/category';
import { faker } from '@faker-js/faker';
import { BrandService } from '../services/brand';
import { IBrand } from '../models/brand';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

async function connect() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: 'sneakpeak' });
    await generateData(process.argv[2], process.argv[3], process.argv[4]);
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error connecting to MongoDB: ', error);
  }
}
connect();

// on récupere le model passé en argument et on génère des données en fonction
// on peut aussi supprimer les données existantes en passant un argument
// on génère un nombre de données passé en argument
const generateData = async (model: string, isDelete: string, count: string) => {
  switch (model.toLowerCase()) {
    case 'user':
      await generateDataModelUser(parseInt(count));
      console.log('Data generated for User model');
      break;
    case 'sneaker':
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
    default:
      return console.log('Model not found');
  }
};

// on génère 10 utilisateurs par défaut
async function generateDataModelUser(count: number = 10) {
  for (let i = 0; i < count; i++) {
    const email: string = faker.internet.email();
    const password = 'ExemplePassword1!';
    await UserService.registerUser(email, password);
    console.log('Email ' + email + ' with password ' + password);
    console.log('User ' + i + ' created');
  }
}

// on génère 10 brands par défaut et supprimer est à false par défaut
async function generateDataModelBrand(
  isDelete: boolean = false,
  count: number = 10,
) {
  if (isDelete) {
    const brands: HydratedDocument<IBrand>[] = await BrandService.findBrands();
    for (const brand of brands) {
      await BrandService.delete(brand._id);
    }
  }

  for (let i = 1; i <= count; i++) {
    await BrandService.create(
      faker.lorem.word(),
      faker.image.url(),
      faker.datatype.boolean(),
      faker.datatype.boolean(),
    );
    console.log(`Brand ${i} created`);
  }
}

// on génère 10 categories par défaut et supprimer est à false par défaut
async function generateDataModelCategory(
  isDelete: boolean = false,
  count: number = 10,
) {
  if (isDelete) {
    const categories = await CategoryService.findCategories();
    for (const category of categories) {
      await CategoryService.delete(category._id);
    }
  }
  for (let i = 0; i < count; i++) {
    await CategoryService.create(
      faker.lorem.word(),
      faker.image.url(),
      faker.datatype.boolean(),
      faker.datatype.boolean(),
    );
    console.log('Category ' + i + ' created');
  }
}

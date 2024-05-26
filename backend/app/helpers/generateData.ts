import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { CategoryService } from '../services/category';
import { faker } from '@faker-js/faker';
import { BrandService } from '../services/brand';
import { IBrand } from '../models/Brand';
// import { UserModel } from '../models/user';
import { SneakerService } from '../services/SneakerRouter';
import { ISneaker } from '../models/Sneaker';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

async function connect(): Promise<void> {
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
      // await generateDataModelUser(parseInt(count));
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
    default:
      return console.log('Model not found');
  }
};

// on génère 10 utilisateurs par défaut
// async function generateDataModelUser(count: number = 10): Promise<void> {
//   for (let i = 0; i < count; i++) {
//     const email: string = faker.internet.email();
//     const password: string = 'ExemplePassword1!';
//     const firstName: string = faker.person.firstName();
//     const lastName: string = faker.person.lastName();
//     const phone: string = faker.phone.number();
//     const billingAddresses: Array<object> = [
//       {
//         street: faker.location.street(),
//         city: faker.location.city(),
//         postalCode: faker.location.zipCode(),
//         country: faker.location.country(),
//         isDefault: true,
//       },
//     ];
//     const shippingAddresses: Array<object> = [
//       {
//         street: faker.location.street(),
//         city: faker.location.city(),
//         postalCode: faker.location.zipCode(),
//         country: faker.location.country(),
//         isDefault: true,
//       },
//     ];
//     const createdAt: Date = new Date();
//     const updatedAt: Date = new Date();
//     const challenge: object = {
//       email: {
//         verified: true,
//         token: faker.string.uuid(),
//         expiresAt: faker.date.future(),
//       },
//     };
//     await UserModel.create({
//       email,
//       password,
//       challenge,
//       firstName,
//       lastName,
//       phone,
//       billingAddresses,
//       shippingAddresses,
//       createdAt,
//       updatedAt,
//     });
//     console.log('User' + i + ' email: ' + email + ' password: ' + password);
//     console.log('User ' + i + ' created');
//   }
// }

// on génère 10 brands par défaut et supprimer est à false par défaut
async function generateDataModelBrand(
  isDelete: boolean = false,
  count: number = 10,
): Promise<void> {
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
): Promise<void> {
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

async function generateDataModelSneaker(
  isDelete: boolean = false,
  count: number = 10,
): Promise<void> {
  if (isDelete) {
    const sneakers = await SneakerService.findSneakers();
    sneakers.forEach(async (sneaker: HydratedDocument<ISneaker>) => {
      await SneakerService.delete(sneaker._id);
    });
  }

  for (let i = 0; i < count; i++) {
    await SneakerService.create(
      faker.lorem.word(),
      faker.lorem.word(),
      faker.lorem.sentence(),
      faker.number.float({ min: 50, max: 250, multipleOf: 0.1 }),
      faker.lorem.word(),
      faker.lorem.word(),
      faker.image.url(),
      faker.datatype.boolean(),
      faker.datatype.boolean(),
      [
        {
          name: faker.lorem.word(),
          image: faker.image.url(),
          sizes: [
            {
              reference: faker.lorem.word(),
              size: faker.number.int({ min: 35, max: 50 }),
              stock: faker.number.int({ min: 0, max: 100 }),
            },
          ],
        },
      ],
    );
    console.log('Sneaker ' + i + ' created');
  }
}

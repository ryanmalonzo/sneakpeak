import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { UserManager } from '../services/userManager';
import { faker } from '@faker-js/faker';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

mongoose
  .connect(MONGODB_URI, { dbName: 'sneakpeak' })
  .then(() => {
    console.log('MongoDB connected');
  })
  .then(() => {
    generateData(process.argv[2]);
  })
  .catch((err) => {
    console.error(err);
  });

// on récupere le model passé en argument et on génère des données en fonction
const generateData = async (model: any) => {
  switch (model) {
    case 'user':
      generateDataModelUser();
      console.log('Data generated for User model');
      break;
    default:
      return console.log('Model not found');
  }
};

// on génère 10 utilisateurs
function generateDataModelUser() {
  for (let i = 0; i < 10; i++) {
    UserManager.create(faker.internet.email(), faker.internet.password());
    console.log('User created');
  }
}

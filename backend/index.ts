import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app/index.js';
import { sequelize } from './app/models/index.js';
import syncWithMongoDB from './app/helpers/syncPsqlMongo.js';

dotenv.config();

const MONGODB_URI: string = process.env.MONGODB_URI || '';
const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(() => {
    sequelize.sync();
    console.log('PostgreSQL connected');
  })
  .catch((err) => {
    console.error(err);
  });

// Synchroniser les données entre PostgreSQL et MongoDB
sequelize.afterBulkCreate((options: any) => {
  const modelName = options.model.name;
  const createdData = options.attributes;
  syncWithMongoDB(modelName, 'create', createdData);
});

sequelize.afterBulkUpdate((options: any) => {
  const modelName = options.model.name;
  const updatedData = options.attributes;
  syncWithMongoDB(modelName, 'update', updatedData);
});

sequelize.afterBulkDestroy((options: any) => {
  const modelName = options.model.name;
  const deletedData = options.where;
  syncWithMongoDB(modelName, 'delete', deletedData);
});

mongoose
  .connect(MONGODB_URI, { dbName: 'sneakpeak' })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error(err);
  });

app.listen(PORT, () => {
  console.log(`SneakPeak API listening on port ${PORT}`);
});

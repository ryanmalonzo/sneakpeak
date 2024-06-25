import sinon from 'sinon';
import { PostmarkClient } from '../../app/helpers/postmark';
import { sequelize } from '../../app/models';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

before(async () => {
  // Avoid sending emails
  sinon.stub(PostmarkClient, 'sendEmail').resolves();

  await sequelize.authenticate();
  await sequelize.sync({ force: true });

  await mongoose
    .connect(MONGODB_URI, { dbName: 'sneakpeak' })
    .then(() => {
      console.log('MongoDB connected');
    })
    .catch((err) => {
      console.error(err);
    });
});

after(async () => {
  sinon.restore();
  await sequelize.close();
  await mongoose.connection.close();
});

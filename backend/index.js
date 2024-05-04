import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app/index.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGODB_URI, { dbName: 'sneakpeak' })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error(err);
  });

app.listen(PORT, () => {
  console.log(`SneakPeak API listening on port ${PORT}`)
});


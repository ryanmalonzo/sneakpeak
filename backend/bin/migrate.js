const dotenv = require('dotenv');
dotenv.config();

const { sequelize } = require('../app/models');

const key = process.argv[2]?.slice(2) ?? 'alter';

sequelize
  .sync({ [key]: true })
  .then(() => console.log('Database synchronized'))
  .then(() => sequelize.close());

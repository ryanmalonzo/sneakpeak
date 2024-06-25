const dotenv = require('dotenv');
dotenv.config();

const { sequelize } = require('../app/models');
const { Umzug, SequelizeStorage } = require('umzug');

const umzug = new Umzug({
  migrations: { glob: 'migrations/*.ts' },
  context: sequelize,
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

if (require.main === module) {
  // npm run migrate up/down
  umzug.runAsCLI();
}

export type Migration = typeof umzug._types.migration;

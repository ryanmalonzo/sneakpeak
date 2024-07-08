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
  if (process.argv[2] === 'down') {
    umzug.down().then(() => process.exit(0));
  } else {
    umzug.up().then(() => process.exit(0));
  }
}

export type Migration = typeof umzug._types.migration;

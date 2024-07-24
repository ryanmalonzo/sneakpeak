import { DataTypes, Sequelize } from 'sequelize';
import { Migration } from '../bin/migrate';

export const up: Migration = async ({
  context: sequelize,
}: {
  context: Sequelize;
}) => {
  await sequelize.getQueryInterface().changeColumn('sneakers', 'description', {
    type: DataTypes.TEXT,
    allowNull: false,
  });
};

export const down: Migration = async ({
  context: sequelize,
}: {
  context: Sequelize;
}) => {
  await sequelize.getQueryInterface().changeColumn('sneakers', 'description', {
    type: DataTypes.STRING,
    allowNull: false,
  });
};

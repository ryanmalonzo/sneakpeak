import { DataTypes, Sequelize } from 'sequelize';
import { Migration } from '../bin/migrate';

// ATTENTION à bien underscorer manuellement les noms de colonnes
export const up: Migration = async ({
  context: sequelize,
}: {
  context: Sequelize;
}) => {
  await sequelize.getQueryInterface().createTable('users', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    roles: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: ['USER'],
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
  });
};

export const down: Migration = async ({
  context: sequelize,
}: {
  context: Sequelize;
}) => {
  await sequelize.getQueryInterface().dropTable('users');
};

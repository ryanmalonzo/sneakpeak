import { DataTypes, Sequelize } from 'sequelize';
import { Migration } from '../bin/migrate';

// ATTENTION à bien underscorer manuellement les noms de colonnes
export const up: Migration = async ({
  context: sequelize,
}: {
  context: Sequelize;
}) => {
  const queryInterface = sequelize.getQueryInterface();

  await queryInterface.addColumn('users', 'password_attempts', {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  });

  await queryInterface.addColumn('users', 'locked', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  });

  await queryInterface.addColumn('users', 'unlocked_at', {
    type: DataTypes.DATE,
  });
};

export const down: Migration = async ({
  context: sequelize,
}: {
  context: Sequelize;
}) => {
  const queryInterface = sequelize.getQueryInterface();

  await queryInterface.removeColumn('users', 'password_attempts');
  await queryInterface.removeColumn('users', 'locked');
  await queryInterface.removeColumn('users', 'unlocked_at');
};

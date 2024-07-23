import { DataTypes, Sequelize } from 'sequelize';
import { Migration } from '../bin/migrate';

// ATTENTION à bien underscorer manuellement les noms de colonnes
export const up: Migration = async ({
  context: sequelize,
}: {
  context: Sequelize;
}) => {
  await sequelize.getQueryInterface().addColumn('orders', 'payment_intent', {
    type: DataTypes.TEXT,
    allowNull: true,
  });

  await sequelize.getQueryInterface().addColumn('orders', 'amount_refunded', {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  });
};

export const down: Migration = async ({
  context: sequelize,
}: {
  context: Sequelize;
}) => {
  await sequelize.getQueryInterface().removeColumn('orders', 'payment_intent');

  await sequelize.getQueryInterface().removeColumn('orders', 'amount_refunded');
};

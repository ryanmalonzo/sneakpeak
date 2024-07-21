import { DataTypes, Sequelize } from 'sequelize';
import { Migration } from '../bin/migrate';

// ATTENTION à bien underscorer manuellement les noms de colonnes
export const up: Migration = async ({
  context: sequelize,
}: {
  context: Sequelize;
}) => {
  await sequelize.getQueryInterface().addColumn('order_products', 'is_refund', {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  });
};

export const down: Migration = async ({
  context: sequelize,
}: {
  context: Sequelize;
}) => {
  await sequelize
    .getQueryInterface()
    .removeColumn('order_products', 'is_refund');
};

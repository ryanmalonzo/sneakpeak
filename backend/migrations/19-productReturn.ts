import { DataTypes, Sequelize } from 'sequelize';
import { Migration } from '../bin/migrate';

// ATTENTION à bien underscorer manuellement les noms de colonnes
export const up: Migration = async ({
  context: sequelize,
}: {
  context: Sequelize;
}) => {
  await sequelize.getQueryInterface().createTable('product_returns', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    order_products_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'order_products',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
  });
};

export const down: Migration = async ({
  context: sequelize,
}: {
  context: Sequelize;
}) => {
  await sequelize.getQueryInterface().dropTable('product_returns');
};

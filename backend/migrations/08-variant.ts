import { DataTypes, Sequelize } from 'sequelize';
import { Migration } from '../bin/migrate';

// ATTENTION à bien underscorer manuellement les noms de colonnes
export const up: Migration = async ({
  context: sequelize,
}: {
  context: Sequelize;
}) => {
  await sequelize.getQueryInterface().createTable('variants', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_best: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    sneaker_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sneakers',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    color_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'colors',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    size_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sizes',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  });
};

export const down: Migration = async ({
  context: sequelize,
}: {
  context: Sequelize;
}) => {
  await sequelize.getQueryInterface().dropTable('variants');
};

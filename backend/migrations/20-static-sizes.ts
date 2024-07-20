import { Sequelize } from 'sequelize';
import { Migration } from '../bin/migrate';

// ATTENTION à bien underscorer manuellement les noms de colonnes
export const up: Migration = async ({
  context: sequelize,
}: {
  context: Sequelize;
}) => {
  await sequelize.getQueryInterface().bulkInsert('sizes', [
    { name: '35', slug: '35', created_at: new Date(), updated_at: new Date() },
    { name: '36', slug: '36', created_at: new Date(), updated_at: new Date() },
    { name: '37', slug: '37', created_at: new Date(), updated_at: new Date() },
    { name: '38', slug: '38', created_at: new Date(), updated_at: new Date() },
    { name: '39', slug: '39', created_at: new Date(), updated_at: new Date() },
    { name: '40', slug: '40', created_at: new Date(), updated_at: new Date() },
    { name: '41', slug: '41', created_at: new Date(), updated_at: new Date() },
    { name: '42', slug: '42', created_at: new Date(), updated_at: new Date() },
    { name: '43', slug: '43', created_at: new Date(), updated_at: new Date() },
    { name: '44', slug: '44', created_at: new Date(), updated_at: new Date() },
    { name: '45', slug: '45', created_at: new Date(), updated_at: new Date() },
    { name: '46', slug: '46', created_at: new Date(), updated_at: new Date() },
    { name: '47', slug: '47', created_at: new Date(), updated_at: new Date() },
    { name: '48', slug: '48', created_at: new Date(), updated_at: new Date() },
  ]);
};

export const down: Migration = async ({
  context: sequelize,
}: {
  context: Sequelize;
}) => {
  await sequelize.getQueryInterface().bulkDelete('sizes', {
    slug: [
      '35',
      '36',
      '37',
      '38',
      '39',
      '40',
      '41',
      '42',
      '43',
      '44',
      '45',
      '46',
      '47',
      '48',
    ],
  });
};

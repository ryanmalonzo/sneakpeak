import { Sequelize } from 'sequelize';
import { Migration } from '../bin/migrate';

// ATTENTION à bien underscorer manuellement les noms de colonnes
export const up: Migration = async ({
  context: sequelize,
}: {
  context: Sequelize;
}) => {
  await sequelize.getQueryInterface().bulkInsert('sizes', [
    { name: '35', slug: '35' },
    { name: '36', slug: '36' },
    { name: '37', slug: '37' },
    { name: '38', slug: '38' },
    { name: '39', slug: '39' },
    { name: '40', slug: '40' },
    { name: '41', slug: '41' },
    { name: '42', slug: '42' },
    { name: '43', slug: '43' },
    { name: '44', slug: '44' },
    { name: '45', slug: '45' },
    { name: '46', slug: '46' },
    { name: '47', slug: '47' },
    { name: '48', slug: '48' },
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

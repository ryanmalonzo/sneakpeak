process.env.NODE_ENV = 'test';
process.env.NODE_NO_WARNINGS = 1;

module.exports = {
  require: ['esm', 'tsx'],
  timeout: '30000',
};

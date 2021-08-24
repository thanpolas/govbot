// const { defaultFields } = require('../migration-helpers');

exports.up = async function (knex) {
  // Required if gen_random_uuid() PG method doesn't work:
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS pgcrypto');
};

exports.down = async function () {
  return true;
};

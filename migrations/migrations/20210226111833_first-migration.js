const { defaultFields } = require('../migration-helpers');

exports.up = async function (knex) {
  // Required if gen_random_uuid() PG method doesn't work:
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS pgcrypto');

  await knex.schema.createTable('vote_ends_alert', function (table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    table.string('space').notNullable();
    table.timestamp('expires_at').notNullable();
    table.timestamp('alert_at').notNullable();
    table.boolean('alert_twitter_dispatched').notNullable.defaultTo(false);
    table.boolean('alert_discord_dispatched').notNullable.defaultTo(false);

    defaultFields(table, knex);
  });
};

exports.down = async function () {
  return true;
};

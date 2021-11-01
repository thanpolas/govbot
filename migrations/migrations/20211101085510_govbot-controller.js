const { defaultFields } = require('../migration-helpers');

exports.up = async function (knex) {
  // Required if gen_random_uuid() PG method doesn't work:
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS pgcrypto');

  await knex.schema.createTable('govbot_controller', function (table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    table.string('space').notNullable();
    table.boolean('has_twitter').notNullable().defaultTo(false);
    table.string('twitter_consumer_key');
    table.string('twitter_consumer_secret');
    table.string('twitter_access_token');
    table.string('twitter_access_token_secret');
    table.boolean('has_discord').notNullable().defaultTo(false);
    table.string('discord_token');
    table.string('discord_gov_channel_id');
    table.boolean('wants_vote_end_alerts').notNullable().defaultTo(false);
    table.boolean('wants_discourse_integration').notNullable().defaultTo(false);

    defaultFields(table, knex);
  });

  await knex.schema.createTable('discourse_integrations', function (table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('govbot_controller_id')
      .references('govbot_controller.id')
      .notNullable()
      .onDelete('CASCADE');
    table.string('discourse_category_url').notNullable();

    defaultFields(table, knex);
  });
};

exports.down = async function () {
  return true;
};

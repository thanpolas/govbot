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

  await knex.schema.alterTable('vote_ends_alert', function (table) {
    table.string('proposal_id');
  });

  const alertRecords = await knex.select('id', 'link').from('vote_ends_alert');
  const promises = alertRecords.map((alertRecord) => {
    // https://snapshot.org/#/balancer/proposal/0xadd41023d90e4e66bc1af834f7a3951b7c6171388d24f3779afed4ca9ad75a9e
    const lastSlash = alertRecord.link.lastIndexOf('/');
    const proposal_id = alertRecord.link.substring(lastSlash + 1);

    return knex
      .table('vote_ends_alert')
      .where('id', alertRecord.id)
      .update({ proposal_id });
  });

  await Promise.all(promises);
  // await knex.schema.alterTable('vote_ends_alert', function (table) {
  //   table.string('proposal_id').notNullable().alter();
  //   table.unique('proposal_id');
  // });
};

exports.down = async function () {
  return true;
};

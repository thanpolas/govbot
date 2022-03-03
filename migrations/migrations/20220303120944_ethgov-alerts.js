exports.up = async function (knex) {
  await knex.schema.alterTable('vote_ends_alert', function (table) {
    table
      .boolean('alert_ethgov_twitter_dispatched')
      .notNullable()
      .defaultTo(false);
  });
};

exports.down = async function () {
  return true;
};

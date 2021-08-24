/**
 * @fileoverview Library responsible for migration operations, gets used only
 *   on special occasions like:
 *   * Heroku deployment.
 */

const Knex = require('knex');

const { knexConfig } = require('./postgres.service');
const globals = require('../utils/globals');
const log = require('./log.service').get();

const migrationService = (module.exports = {});

migrationService.runHerokuMigration = async () => {
  if (!globals.isHeroku) {
    return;
  }
  log.info('runHerokuMigration() Init');
  const db = Knex(knexConfig());

  try {
    await db.migrate.latest();
  } catch (ex) {
    await log.error('runHerokuMigration() Failed to run.', { error: ex });
  }

  await db.destroy();

  log.info('runHerokuMigration() All done');
};

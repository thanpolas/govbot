/**
 * @fileoverview Setup files are for setting up and tearing down your test cases.
 */

const invariant = require('invariant');

const { db } = require('../../app/services/postgres.service');

const setup = (module.exports = {});

/**
 * Delete all trade records.
 *
 * @return {Promise<void>}
 */
setup.deleteAll = async () => {
  const dbName = db().context.client.connectionSettings.database;

  invariant(
    dbName === 'yourdb-test',
    `Not in testing db, cannot truncate trade records. dbName: ${dbName}`,
  );

  await db()('trades').truncate();
};

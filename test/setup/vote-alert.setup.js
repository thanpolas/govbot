/**
 * @fileoverview Setup vote alert test cases.
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
    dbName === 'govbot-test',
    `Not in testing db, cannot truncate trade records. dbName: ${dbName}`,
  );

  await db()('vote_ends_alert').truncate();
};

/**
 * Get all the records.
 *
 * @return {Promise<Array<Object>>} A Promise with all the records.
 */
setup.getAll = async () => {
  const records = await db().select().from('vote_ends_alert');
  return records;
};

/**
 * Creates a record.
 *
 * @param {Object} input Data to create record with.
 * @return {Promise<string>} A Promise with the created id.
 */
setup.insert = async (input) => {
  const statement = db().insert(input).into('vote_ends_alert').returning('id');

  const [result] = await statement;
  return result;
};

/**
 * @fileoverview Alert on vote ending table.
 */

const { db } = require('../../../services/postgres.service');

const sql = (module.exports = {});

/** @const {string} TABLE Define the table to work on */
const TABLE = 'vote_ends_alert';

/**
 * Return the SELECT statement to be performed for all queries.
 *
 * This is the API representation of this model.
 *
 * @return {Object} knex statement.
 */
sql.getSelect = () => {
  const statement = db()
    .select(
      `${TABLE}.id`,
      `${TABLE}.space`,

      `${TABLE}.expires_at`,
      `${TABLE}.alert_at`,

      `${TABLE}.alert_twitter_dispatched`,
      `${TABLE}.alert_discord_dispatched`,

      `${TABLE}.created_at`,
      `${TABLE}.updated_at`,
    )
    .from(TABLE);

  return statement;
};

/**
 * Creates a record.
 *
 * @param {Object} input Sanitized input.
 * @param {Object=} tx Transaction.
 * @return {Promise<Array<string>>} The id tuple of the created record.
 */
sql.create = async (input, tx) => {
  const statement = db().insert(input).into(TABLE).returning('id');

  if (tx) {
    statement.transacting(tx);
  }

  const [result] = await statement;
  return result;
};

/**
 * Update a record.
 *
 * @param {Array<string>} id The record ID.
 * @param {Object} input The data to be updated
 * @param {Object=} tx Transaction.
 * @return {Promise<Array<string>|void>} The id or nothing if
 *    record not found.
 */
sql.update = async (id, input = {}, tx) => {
  input.updated_at = db().fn.now();

  const statement = db()
    .table(TABLE)
    .where('id', id)
    .update(input)
    .returning('id');

  if (tx) {
    statement.transacting(tx);
  }

  const [result] = await statement;
  return result;
};

/**
 * Get record by its chain_id and lp_token_address.
 *
 * @param {Array<string>} recordTuple The record ID tuple [chain_id, lp_token_address].
 * @param {Object=} tx Transaction.
 * @return {Promise<Object|void>} A Promise with the record if found.
 */
sql.getAlerts = async (recordTuple, tx) => {
  const [chain_id, lp_token_address] = recordTuple;

  const statement = sql.getSelect().where({ chain_id, lp_token_address });

  if (tx) {
    statement.transacting(tx);
  }

  const [result] = await statement;
  return result;
};

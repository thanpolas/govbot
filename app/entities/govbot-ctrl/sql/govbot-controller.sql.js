/**
 * @fileoverview govbot controller SQL module.
 */

const { db } = require('../../../services/postgres.service');

const sql = (module.exports = {});

/** @const {string} TABLE Define the table to work on */
const TABLE = 'govbot_controller';

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
      `${TABLE}.has_twitter`,
      `${TABLE}.twitter_consumer_key`,
      `${TABLE}.twitter_consumer_secret`,
      `${TABLE}.twitter_access_token`,
      `${TABLE}.twitter_access_token_secret`,
      `${TABLE}.has_discord`,
      `${TABLE}.discord_token`,
      `${TABLE}.discord_gov_channel_id`,
      `${TABLE}.wants_vote_end_alerts`,
      `${TABLE}.wants_discourse_integration`,

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
 * @param {Object} updateData The data to be updated
 * @param {Object=} tx Transaction.
 * @return {Promise<Array<string>|void>} The id or nothing if
 *    record not found.
 */
sql.update = async (id, updateData, tx) => {
  updateData.updated_at = db().fn.now();

  const statement = db()
    .table(TABLE)
    .where('id', id)
    .update(updateData)
    .returning('id');

  if (tx) {
    statement.transacting(tx);
  }

  const [result] = await statement;
  return result;
};

/**
 * Get all records.
 *
 * @param {Object=} tx Transaction.
 * @return {Promise<Array<Object|void>>} A Promise with the record[s] if found.
 */
sql.getAll = async (tx) => {
  const statement = sql.getSelect();

  if (tx) {
    statement.transacting(tx);
  }

  const result = await statement;
  return result;
};

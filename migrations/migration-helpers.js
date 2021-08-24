/**
 * @fileoverview Generic Migration helpers.
 */

const mhelpers = (module.exports = {});

/**
 * Adds default fields to a table:
 *
 * - created_at
 * - updated_at
 *
 * Also creates indexes for created_at.
 *
 * @param {Object} table Knex's Table instance.
 * @param {Object} knex Knex instance.
 * @param {Object=} opts Additional options.
 * @param {boolean=} opts.ommitUpdate Do not add updated_at.
 */
mhelpers.defaultFields = (table, knex, opts = {}) => {
  const options = { ommitUpdate: false, ...opts };

  table.timestamp('created_at').defaultTo(knex.fn.now());
  table.index('created_at');

  if (!options.ommitUpdate) {
    table.timestamp('updated_at');
  }
};

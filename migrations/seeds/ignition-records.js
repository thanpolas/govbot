/**
 * @fileoverview Create initial data for starting the service.
 */

require('dotenv').config();

const seed = (module.exports = {});

/**
 * Create initial data for starting the service.
 *
 * @param {Object} knex Knex instance.
 * @return {Promise}
 */
seed.seed = async (knex) => {
  // const records = [{}, {}];
  // const promises = records.map((record) => {
  //   return knex.insert(record).into('tablename');
  // });
  // await Promise.all(promises);
};

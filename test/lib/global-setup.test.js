/**
 * @fileoverview Test boot up sequence.
 */

const databaseLib = require('./database.lib');
const { database_name } = require('../../package.json');

module.exports = async () => {
  console.log('\n\nGlobal Test Setup initiates...');
  if (process.env.NUKE_TEST_DB) {
    await databaseLib.recreateDatabase(`${database_name}-test`);
  }
};

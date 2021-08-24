/* eslint-disable no-console */
/**
 * @fileoverview Manual database operations for local development environment.
 */

const testDabaseLib = require('../test/lib/database.lib');
const { database_name } = require('../package.json');

/**
 * Bootstrap of the database operations module.
 *
 */
const init = async () => {
  try {
    await testDabaseLib.recreateDatabase(`${database_name}-dev`);
  } catch (ex) {
    console.error('db-local.script.js failed:', ex);
  }
};

init();

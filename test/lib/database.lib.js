/**
 * @fileoverview Database operations for testing.
 */

const knex = require('knex');
const config = require('config');

const { database_name } = require('../../package.json');

const testDb = (module.exports = {});

/** @const {Array.<string>} ALLOW_NUKE_DB Which database names can be nuked */
const ALLOW_NUKE_DB = [`${database_name}-dev`, `${database_name}-test`];

/**
 * Drop and create test database[s].
 *
 * @param {string=} targetDb The target database to nuke and recreate.
 * @return {Promise} A Promise.
 */
testDb.recreateDatabase = async (targetDb = `${database_name}-dev`) => {
  try {
    const startTime = Date.now();

    await testDb._cleanupDb(targetDb);

    await testDb.runMigrationsAndSeed(config.postgres, true);

    const timeDiff = Date.now() - startTime;

    console.log(
      `\n\n💾 Database ${targetDb} nuked and created, migrations applied, seeds run. ` +
        `Total time: ${timeDiff}ms\n\n`,
    );
  } catch (ex) {
    console.error('test/lib/database.lib.js failed:', ex);
    process.exit(1);
  }
};

/**
 * Run migrations and seed files on database using the provided
 * connection string.
 *
 * @param {Object} dbConfig The db config.
 * @param {boolean} runSeeds Run seeds script control.
 * @return {Promise}
 */
testDb.runMigrationsAndSeed = async (dbConfig, runSeeds) => {
  const knexOpts = {
    client: 'pg',
    connection: dbConfig.connection_string,
    migrations: {
      directory: dbConfig.migrations.directory,
    },
    seeds: {
      directory: './migrations/seeds',
      specific: 'ignition-records.js',
    },
  };

  const db = knex(knexOpts);

  await db.migrate.latest();

  if (runSeeds) {
    await db.seed.run();
  }

  await db.destroy();
};

/**
 * Deletes and recreates needed test databases.
 *
 * @param {string} targetDb The target srop core database to nuke and recreate.
 * @return {Promise} A Promise.
 * @private
 */
testDb._cleanupDb = async (targetDb) => {
  if (!ALLOW_NUKE_DB.includes(targetDb)) {
    throw new Error(`Database name not in allowed list. Name: ${targetDb}`);
  }

  // Using a generic connection string to the "postgres" db so
  // that the target databases we want to nuke and recreate and lock free.
  const connString = config.postgres.connection_string_reset;

  const knexOpts = {
    client: 'pg',
    connection: connString,
  };

  const db = knex(knexOpts);
  // verify that SQL connection has been established
  await db.raw('SELECT 1');

  await testDb.nukeAndRecreate(db, targetDb);
  await db.destroy();
};

/**
 * Performs the actual nuking and recreation of databases.
 *
 * @param {Knex} db Knex instance.
 * @param {string} databaseName The name of the database to drop and recreate.
 * @return {Promise} A Promise.
 */
testDb.nukeAndRecreate = async (db, databaseName) => {
  console.log(`Droping database ${databaseName}`);
  // Kill all active connections
  const sqlKillall =
    'SELECT pg_terminate_backend(pid) FROM pg_stat_activity' +
    ` WHERE datname = '${databaseName}'`;
  await db.raw(sqlKillall);
  await db.raw(`DROP DATABASE IF EXISTS "${databaseName}"`);
  await db.raw(`CREATE DATABASE "${databaseName}"`);
};

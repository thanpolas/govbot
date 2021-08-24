/**
 * @fileoverview Initializes main data store. In this case, Postgres using Knex.
 */
const config = require('config');
const knex = require('knex');
const { ConnectionString } = require('connection-string');

const globals = require('../utils/globals');
const log = require('./log.service').get();

const sqldb = (module.exports = {});

/** @type {Knex?} Will store the knex instance reference */
sqldb.knexCore = null;

/**
 * Generates appropriate PG config.
 *
 * @return {Object} knex config.
 */
sqldb.knexConfig = () => {
  const conf = {
    client: 'pg',
    connection: config.postgres.connection_string,
    migrations: {
      directory: config.postgres.migrations.directory,
    },
    debug: false,
    pool: {
      min: config.postgres.pool_min,
      max: config.postgres.pool_max,
    },
  };

  // When on Heroku, the connection string has to be broken out into
  // configuration items so the "rejectUnauthorized" option can be inserted
  // into the connection configuration for PG to use it.
  // This is done because Heroku uses self-signed SSL certificates for postgres.
  if (globals.isProd) {
    // eslint-disable-next-line no-unused-vars
    const connStr = config.postgres.connection_string;
    // Sample Conn string
    // postgres://username:password@hostname.amazonaws.com:5432/dbname
    const connParts = new ConnectionString(connStr);
    // {hosts: [{name: 'my-server', port: 12345, type: 'domain'}]}

    conf.connection = {
      host: connParts.hostname,
      port: connParts.port,
      user: connParts.user,
      password: connParts.password,
      database: connParts.path && connParts.path[0],
      ssl: { rejectUnauthorized: false },
    };
  }

  return conf;
};

/**
 * Initialize and connect to core and secrets data store using knex.
 *
 * @return {Promise<Knex>} A knex client.
 */
sqldb.init = async () => {
  //
  // Connect to Main Data Store
  //
  sqldb.knexCore = knex(sqldb.knexConfig());

  log.notice('Connected to Postgres.');
};

/**
 * Return Core Knex instance.
 *
 * @return {Knex}
 */
sqldb.db = () => sqldb.knexCore;

/**
 * Closes database connections.
 *
 * @return {Promise<void>}
 */
sqldb.dispose = async () => {
  await sqldb.db().destroy();
  delete sqldb.db;
  await log.warn('Closed all postgres connections.');
};

/**
 * @fileoverview Test postgres connection string parser.
 */

const config = require('config');

require('../lib/test.lib');

const globals = require('../../app/utils/globals');
const pgService = require('../../app/services/postgres.service');

describe('UNIT PG Connection String', () => {
  describe('Connection String', () => {
    test('Will return appropriate connection object for knex', () => {
      const connStr = config.postgres.connection_string;
      const connStrMock =
        'postgres://username:password@hostname.amazonaws.com:5432/dbname';

      config.postgres.connection_string = connStrMock;
      globals.isProd = true;

      const connOpts = pgService.knexConfig();

      const { connection: conn } = connOpts;

      expect(conn.host).toEqual('hostname.amazonaws.com');
      expect(conn.user).toEqual('username');
      expect(conn.password).toEqual('password');
      expect(conn.database).toEqual('dbname');

      globals.isProd = false;
      config.postgres.connection_string = connStr;
    });
  });
});

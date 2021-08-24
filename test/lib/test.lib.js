/**
 * @fileoverview Core testing library, must be included by all tests.
 */

const faker = require('faker');
require('dotenv').config();

const logger = require('../../app/services/log.service');
const packagejson = require('../../package.json');

const {
  toBeISODate,
  toBeUUID,
  toBeEmail,
} = require('../assert/expect-extend.assert');

// Initialize logger early.
logger.init({
  appName: `${packagejson.name}-test`,
  suppressLogging: false,
});

const log = logger.get();

// Set proper node environment
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'test';
}

// Setup unhandled promise rejection handler, helps during low-level
// testing.
process.on('unhandledRejection', (error) => {
  log.error('TEST :: Unhandled Promise Rejection', { error });
});

const testLib = (module.exports = {});

const app = require('../..');

//
// Mock discord client
//
const discordService = require('../../app/services/discord.service');

testLib.discordOn = jest.fn();
discordService._client = {
  on: testLib.discordOn,
  user: {
    id: faker.datatype.number(999999999999999999),
  },
  destroy: () => {},
};

/** @type {boolean}  Toggle to extend expect. */
let expectExtended = false;

/**
 * Core testing library, must be included by all tests.
 *
 */
testLib.init = () => {
  beforeAll(async () => {
    await app.init({ testing: true });
  });

  // Cleanly exit
  afterAll(async () => {
    await app.dispose();
  });

  if (!expectExtended) {
    expectExtended = true;
    // Augment expect
    expect.extend({
      toBeISODate,
      toBeUUID,
      toBeEmail,
    });
  }
};

/**
 * @fileoverview Core testing library, must be included by all tests.
 */

require('dotenv').config();

const config = require('config');
const faker = require('faker');
const request = require('supertest');

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
  suppressLogging: true,
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

/**
 * Returns the express instance reference.
 *
 * @param {Object=} optCookie Set a cookie to propagate, this should be the
 *    output of the testLib.cookieParse() method.
 * @return {Object}
 */
testLib.getAgent = (optCookie) => {
  const express = require('../../app/services/web/express.service');
  const agent = request.agent(express.app);

  agent.set('Accept', 'application/json');
  agent.set('Origin', config.webserver.backend_base_url);
  if (optCookie) {
    agent.set('Cookie', [`${optCookie.name}=${optCookie.value}`]);
  }

  return agent;
};

/**
 * @fileoverview Global values that need runtime calculation.
 *
 */
const os = require('os');

const globals = (module.exports = {});

/**
 * The supported environments
 *
 * @enum {string}
 */
globals.Environments = {
  CIRCLE: 'circleci',
  LOCAL: 'localdev',
  TESTING: 'test',
  HEROKU_PROD: 'production',
};

/**
 * Local cache for hostname.
 *
 * @type {string} The system's hostname.
 */
globals.hostname = os.hostname();

/** @type {boolean} If application runs directly from shell, gets set on app */
globals.isStandAlone = true;

/**
 * Returns the current environemnt based on shell environment variable NODE_ENV
 * defaults to development.
 *
 * @return {string} One of the supported environments.
 */
globals.getEnvironment = function () {
  const env = process.env.NODE_ENV || globals.Environments.LOCAL;

  let currentEnv = globals.Environments.LOCAL;

  Object.keys(globals.Environments).forEach(function (envIter) {
    if (env === globals.Environments[envIter]) {
      currentEnv = env;
    }
  });

  return currentEnv;
};

/**
 * The current environment canonicalized based on supported envs.
 *
 * @type {string}
 */
globals.env = globals.getEnvironment();

/** @type {boolean} If we are on local environment */
globals.isLocal = [globals.Environments.LOCAL].indexOf(globals.env) >= 0;

globals.isTest =
  [globals.Environments.TESTING, globals.Environments.CIRCLE].indexOf(
    globals.env,
  ) >= 0;

/** @type {boolean} Determines if we are on Production environment. */
globals.isProd = false;
if ([globals.Environments.HEROKU_PROD].indexOf(globals.env) >= 0) {
  globals.isProd = true;
}

/** @type {boolean} Determines if we are on heroku environment. */
globals.isHeroku = [globals.Environments.HEROKU_PROD].indexOf(globals.env) >= 0;

/**
 * Cache the Current Working Directory.
 *
 * @type {string}
 */
globals.cwd = process.cwd();

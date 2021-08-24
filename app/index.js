/**
 * ProjectName
 * ProjectDescription
 * https://github.com/thanpolas/discord_bot_template
 *
 * Copyright © Thanos Polychronakis
 * ISC License (ISC).
 */

/**
 * @fileoverview Master bootstrap module.
 */

const fs = require('fs');

const __ = require('lodash');
require('dotenv').config();

require('./utils/jsdoc-type-definitions');
const globals = require('./utils/globals');
const logService = require('./services/log.service');

const APPLICATION_NAME = 'ProjectName';

//
// WARNING
// do not include any more libraries before the log service is initialized.
//
//

/**
 * The master boot.
 *
 */
const app = (module.exports = {});

// define stand alone status
globals.isStandAlone = require.main === module;

let initialized = false;
let exiting = false;
let appServices;

/**
 * Master bootstrap module.
 *
 * Available options to pass on the first arg:
 *
 * @param {Object=} optOpts init params.
 * @param {boolean=} optOpts.testing When true go into testing mode.
 * @param {string=} optOpts.appName Custom application name.
 * @param {boolean=} optOpts.suppressLogging Do not log to stdout.
 * @return {Promise} A Promise.
 */
app.init = async (optOpts) => {
  if (initialized) {
    return;
  }
  initialized = true;

  // Get user & default boot options.
  const bootOpts = app._getBootOpts(optOpts);

  // if run as root, downgrade to the owner of this file
  app._checkRoot();

  // Initialize logging service
  logService.init(bootOpts);

  const log = logService.get();

  log.notice(
    `Initializing. standAlone: ${globals.isStandAlone}` +
      ` :: System NODE_ENV: ${process.env.NODE_ENV} :: App Environment:` +
      ` ${globals.env}`,
    {
      custom: {
        stand_alone: globals.isStandAlone,
        env_process: process.env.NODE_ENV,
        env_application: globals.env,
      },
    },
  );

  app._setupErrorHandlers(log);

  appServices = require('./services.boot');

  try {
    await appServices.boot(bootOpts);
  } catch (ex) {
    await log.emergency('Error on boot:', { error: ex });
    if (!globals.isStandAlone) {
      throw ex;
    }
  }
};

/**
 * Catch-all for App exit
 *
 * @param {Object} options Options as passed from listeners.
 * @param {string} options.type Reason for shutdown.
 * @param {boolean} options.exit If process.exit() should be called.
 * @param {number} options.exitCode Exitcode to return.
 * @param {Error=} error An error object.
 * @return {Promise<void>}
 */
app.handleNodeExit = async (options, error) => {
  if (exiting) {
    return;
  }
  exiting = true;

  const { exit = true, exitCode = 0, type } = options;

  const log = logService.get();
  log.notice('Received exit code', {
    custom: { type },
  });

  if (error instanceof Error) {
    await log.alert('Node app exits with error', { error });
  }

  await app.dispose();

  if (exit) {
    process.exit(exitCode);
  }
};

/**
 * Local expose method.
 */
app.dispose = async () => {
  await appServices.dispose();
};

/**
 * Setup global error handlers.
 *
 * @param {Object} log Logger.
 * @private
 */
app._setupErrorHandlers = function (log) {
  process.on(
    'SIGINT',
    app.handleNodeExit.bind(null, {
      type: 'SIGINT',
    }),
  );
  process.on(
    'SIGTERM',
    app.handleNodeExit.bind(null, {
      type: 'SIGTERM',
    }),
  );
  process.on(
    'uncaughtException',
    app.handleNodeExit.bind(null, {
      type: 'uncaughtException',
      exitCode: 99,
    }),
  );
  process.on('unhandledRejection', async (error) => {
    await log.critical('Unhandled Promise Rejection', { error });
  });
};

/**
 * Apply the default boot options unless defined in provided options.
 *
 * @param {Object=} optOpts Boot options as defined by user.
 * @return {Object} Defined options with their default or user defined values.
 * @private
 */
app._getBootOpts = (optOpts) => {
  let userOpts = {};
  if (__.isObject(optOpts)) {
    userOpts = optOpts;
  }

  /** @type {Object} define default options */
  const bootOpts = __.defaults(userOpts, {
    // launch webserver
    webserver: true,

    // Suppress logging to console
    suppressLogging: userOpts.suppressLogging,

    appName: userOpts.appName || APPLICATION_NAME,
  });

  return bootOpts;
};

/**
 * if run as root, downgrade to the owner of this file
 *
 * @private
 */
app._checkRoot = () => {
  if (process.getuid() === 0) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    fs.stat(__filename, function (err, stats) {
      if (err) {
        // eslint-disable-next-line no-console
        return console.error('Failed to downgrade from root. Error:', err);
      }
      process.setuid(stats.uid);
    });
  }
};

// ignition
if (globals.isStandAlone) {
  app.init();
}

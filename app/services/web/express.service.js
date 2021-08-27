/**
 * @fileoverview The core express instance, requires all others.
 */

const path = require('path');

const config = require('config');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const enforce = require('express-sslify');
const noCache = require('nocache');
const noSniff = require('dont-sniff-mimetype');

const globals = require('../../utils/globals');
const log = require('../log.service').get();
const router = require('./web-router.service');
const webService = require('./webserver.service');
const { getError } = require('../../utils/errors');

/**
 * The express module.
 *
 */
const expressService = (module.exports = {});

/**
 * Kick off the webserver...
 *
 * @param {Object} bootOpts A set of app-boot options, docs in app index.
 * @return {Promise<void>} a promise.
 */
expressService.init = async function (bootOpts) {
  await log.notice('Starting Express Service...', {
    custom: {
      cors_allowed_origins: config.webserver.cors.allowed_origins,
      cors_base_url: config.webserver.backend_base_url,
    },
  });

  /** @type {Express} The express instance */
  const app = (expressService.app = express());

  //
  // Sequence MATTERS.
  //

  // Initialize webserver
  webService.init(app);

  // Remove x-powered-by header
  app.disable('x-powered-by');

  // Don't cache API responses
  app.use(noCache());

  // Sets "X-Content-Type-Options: nosniff".
  app.use(noSniff());

  app.use(bodyParser.json());

  // Enable HTTP -> HTTPS redirects
  if (config.webserver.enforce_ssl) {
    app.use(enforce.HTTPS({ trustProtoHeader: true }));
  }

  // Setup express
  app.set('port', globals.port);

  // Don't rate limit heroku
  app.enable('trust proxy');
  app.set('trust proxy', 1);

  app.use(cookieParser());

  app.set('views', path.join(__dirname, 'views'));

  // Setup web server routes
  router.setup(app);

  // Express Error Handler
  app.use(expressService._expressError);

  if (!bootOpts.testing) {
    await webService.start(app);
  }
  log.notice('Express Service done.');
};

/**
 * Express Error Handler.
 *
 * @param {Error} error The error that happened.
 * @param {Request} req Express request object.
 * @param {Response} res Express response object.
 * @param {function} next next callback.
 * @private
 */
// eslint-disable-next-line no-unused-vars
expressService._expressError = (error, req, res, next) => {
  // If not an application generated error, mask it with a generic one.
  let useError = error;
  if (!error.botError) {
    log.info('Express Error Handler, not application generated error', {
      error,
    });
    useError = getError('system_error_generic');
  }

  const httpCode = useError.httpCode || 500;

  // sanitize the error into a new clean response object.
  const sanitizedError = {
    error: true,
    error_code: useError.code,
    error_message: useError.message,
  };

  if (globals.isDev) {
    sanitizedError.description = useError.description;
  }

  res.status(httpCode).json(sanitizedError);
};

/**
 * Disposes Express service and all related services.
 *
 * @return {Promise<void>}
 */
expressService.dispose = async () => {
  await webService.dispose();
};

/**
 * @fileoverview Initializes the Logality library and provides the .get() method.
 * @see https://github.com/thanpolas/logality
 */

const Logality = require('logality');

/**
 * WARNING
 *
 * Do not require any other modules at this point, before the log service
 * init() method has been invoked.
 *
 * WARNING
 */

// Serializers
const relaySerializer = require('./log-serializers/relay.serializer');
const emojiSerializer = require('./log-serializers/emoji.serializer');
const guildSerializer = require('./log-serializers/guild.serializer');

const logger = (module.exports = {});

logger.logality = null;

/**
 * Initialize the logging service.
 *
 * @param {Object} bootOpts boot options. This module will check for:
 * @param {string=} bootOpts.appName Set a custom appname for the logger.
 * @param {boolean=} bootOpts.suppressLogging Do not log to stdout.
 */
logger.init = function (bootOpts = {}) {
  // check if already initialized.
  if (logger.logality) {
    return;
  }

  const { appName } = bootOpts;

  const serializers = {
    relay: relaySerializer(),
    emoji: emojiSerializer(),
    guild: guildSerializer(),
  };

  logger.logality = new Logality({
    prettyPrint: true,
    appName,
    async: true,
    serializers,
  });

  // Create the get method
  logger.get = logger.logality.get.bind(logger.logality);

  // Add middleware
  logger._addMiddleware();
};

/**
 * Will add middleware to the logger.
 *
 * @private
 */
logger._addMiddleware = () => {
  const { loggerToAdmin } = require('../entities/admin-logs');

  // Relay flagged messages to admin channel
  logger.logality.use(loggerToAdmin);

  // Delete helper flags and properties
  logger.logality.use((logContext) => {
    delete logContext.emoji;
    delete logContext.relay;
  });
};

/**
 * @fileoverview Twitter service provider.
 */

const TwitterApi = require('twitter');

const log = require('../../services/log.service').get();

/** @type {Object} Dictionary containing twitter client instances, key is space name */
exports.twitterClients = {};

/**
 * Initialize the twitter client.
 *
 * @param {Object} configuration The configuration to initialize twitter with.
 */
exports.init = async (configuration) => {
  if (!configuration.has_twitter) {
    return;
  }
  const twConfig = exports.getConfiguration(configuration);
  // Instanciate with desired auth type (here's Bearer v2 auth)
  const twClient = new TwitterApi(twConfig);

  exports.twitterClients[configuration.space] = twClient;
  await log.info(`Initialized twitter client for ${configuration.space}`);
};

/**
 * Get the twitter client.
 *
 * @param {string} space The space to get the client for.
 * @return {Object} twitter client.
 * @throws {Error} if twitter client is not initialized.
 */
exports.getClient = (space) => {
  if (!exports.twitterClients[space]) {
    throw new Error('Twitter client not ready');
  }

  return exports.twitterClients[space];
};

/**
 * Checks if the twitter client is ready.
 *
 * @param {string} space The space to get the client for.
 * @return {boolean} if the twitter client is ready.
 */
exports.isConnected = (space) => {
  return !!exports.twitterClients[space];
};

/**
 * Will transform global configuration to twitter specific.
 *
 * @param {Object} configuration The configuration to initialize twitter with.
 * @return {Object} Appropriate configuration for twitter client.
 */
exports.getConfiguration = (configuration) => {
  return {
    consumer_key: configuration.twitter_consumer_key,
    consumer_secret: configuration.twitter_consumer_secret,
    access_token_key: configuration.twitter_access_token,
    access_token_secret: configuration.twitter_access_token_secret,
  };
};

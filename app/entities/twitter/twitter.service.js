/**
 * @fileoverview Twitter service provider.
 */

const config = require('config');
const TwitterApi = require('twitter');

const service = (module.exports = {});

/** @type {Object?} Twitter client */
service._twClient = null;

/**
 * Initialize the twitter client.
 *
 */
service.init = () => {
  // Instanciate with desired auth type (here's Bearer v2 auth)
  service._twClient = new TwitterApi(config.twitter.auth_token);
};

/**
 * Get the twitter client.
 *
 * @return {Object} twitter client.
 * @throws {Error} if twitter client is not initialized.
 */
service.getClient = () => {
  if (!service._twClient) {
    throw new Error('Twitter client not ready');
  }

  return service._twClient;
};

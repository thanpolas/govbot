/**
 * @fileoverview Twitter service provider.
 */

const config = require('config');
const TwitterApi = require('twitter-api-v2');

const service = (module.exports = {});

/** @type {Object?} Twitter client */
service._twClient = null;

service.init = () => {
  // Instanciate with desired auth type (here's Bearer v2 auth)
  service._twClient = new TwitterApi(config.twitter.auth_token);
};

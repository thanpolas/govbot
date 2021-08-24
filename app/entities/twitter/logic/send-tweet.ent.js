/**
 * @fileoverview Send twitter messages.
 * @see https://github.com/desmondmorris/node-twitter
 */

const { getClient } = require('../twitter.service');

const entity = (module.exports = {});

/**
 * Send a tweet, no validations are performed.
 *
 * @param {string} status The message to tweet.
 * @return {Promise<Object>} A Promise with the created tweet.
 */
entity.sendTweet = async (status) => {
  const client = getClient();

  return client.post('statuses/update', { status });
};

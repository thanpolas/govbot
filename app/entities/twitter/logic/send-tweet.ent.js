/**
 * @fileoverview Send twitter messages.
 * @see https://github.com/desmondmorris/node-twitter
 */

const truncate = require('truncate');

const { getClient } = require('../twitter.service');
const {
  MAX_CHARS,
  URL_LENGTH,
  ELIPSES_LENGTH,
} = require('../constants/twitter.const');

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

/**
 * Will prepare and format the message to be tweeted.
 *
 * @param {string} rawMessage The message to tweet.
 * @param {string} proposalTitle The proposal Title.
 * @param {string} proposalLink The proposal link.
 * @return {string} Formatted message to tweet.
 */
entity.prepareMessage = (rawMessage, proposalTitle, proposalLink) => {
  let messageTemplateSize = URL_LENGTH + ELIPSES_LENGTH;
  messageTemplateSize += rawMessage.length;
  messageTemplateSize += 7; // 1 colon, 2 quotes and the 4 newlines

  const availableSize = MAX_CHARS - messageTemplateSize;

  const proposalName = truncate(proposalTitle, availableSize);

  const message = `${rawMessage}:\n\n"${proposalName}"\n\n${proposalLink}`;

  return message;
};

/**
 * @fileoverview Send twitter messages.
 * @see https://github.com/desmondmorris/node-twitter
 */

const truncate = require('truncate');
const config = require('config');

const { getClient } = require('../twitter.service');
const { Protocols } = require('../constants/protocols.const');
const {
  MAX_CHARS,
  URL_LENGTH,
  ELIPSES_LENGTH,
} = require('../constants/twitter.const');

const log = require('../../../services/log.service').get();

const entity = (module.exports = {});

/**
 * Send a tweet, no validations are performed.
 *
 * @param {Object} configuration The configuration of this instance.
 * @param {string} status The message to tweet.
 * @return {Promise<Object>} A Promise with the created tweet.
 */
entity.sendTweet = async (configuration, status) => {
  const client = getClient(configuration.space);

  return client.post('statuses/update', { status });
};

/**
 * Will prepare and format the message to be tweeted.
 *
 * @param {string} rawMessage The message to tweet.
 * @param {Object} configuration The configuration of this instance.
 * @param {string} title The title that needs to be tweeted.
 * @param {string} link The link that needs to be tweeted.
 * @return {Promise<string|null>} Formatted message to tweet, or null if error.
 */
entity.prepareMessage = async (rawMessage, configuration, title, link) => {
  // Handle aggregate twitter account
  if (configuration.space === config.app.aggregate_space_char) {
    const daoTwitterHandle = Protocols[configuration.space];
    if (!daoTwitterHandle) {
      await log.error(
        `Failed to find twitter handle for DAO: ${configuration.space}`,
      );
      return null;
    }
    rawMessage += `, at DAO @${daoTwitterHandle}`;
  }

  let messageTemplateSize = URL_LENGTH + ELIPSES_LENGTH;
  messageTemplateSize += rawMessage.length;
  messageTemplateSize += 7; // 1 colon, 2 quotes and the 4 newlines

  const availableSize = MAX_CHARS - messageTemplateSize;

  const proposalName = truncate(title, availableSize);

  const message = `${rawMessage}:\n\n"${proposalName}"\n\n${link}`;

  return message;
};

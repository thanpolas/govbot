/**
 * @fileoverview Handle errors.
 */

const { formatMessage } = require('./generic-formatting.ent');
const { sendLog } = require('./send-message.ent');

const entity = (module.exports = {});

/**
 * Format an log error message to a string and send it to the appropriate channel
 *
 * @param {Object} lc Logality log context object.
 * @param {DiscordChannel} channel The discord channel object to send to.
 * @return {Promise<string>} The string message.
 */
entity.handleErrors = async (lc, channel) => {
  const message = await formatMessage(lc);
  await sendLog(message, channel, lc);
};

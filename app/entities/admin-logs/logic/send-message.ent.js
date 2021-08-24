/**
 * @fileoverview Will make sure a string message is less than 2k characters long by splitting
 *    it, and will send it to the designated channel with error handling.
 */

const BPromise = require('bluebird');
const { splitString } = require('../../../utils/helpers');

const entity = (module.exports = {});

/**
 * Will make sure a string message is less than 2k characters long by splitting
 * it, and will send it to the designated channel with error handling.
 *
 * @param {string} message The message to send.
 * @param {DiscordChannel} channel The discord channel object to send to.
 * @param {Object} logContext The log context.
 * @return {Promise<void>} A Promise.
 */
entity.sendLog = async (message, channel, logContext) => {
  // discord allows up to 2000 chars
  try {
    const splitMessage = splitString(message);
    await BPromise.mapSeries(splitMessage, (msg) => {
      return channel.send(msg);
    });
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.error('Error relaying message to admin channel', {
      logContext,
      error: ex,
    });
  }
};

/**
 * @fileoverview Discord relay snapshot proposals.
 */

const {
  init: initSnapshot,
  createEmbedMessage,
} = require('./logic/handle-snapshot-events.ent');
const { sendEmbedMessage } = require('./logic/send-message.ent');

const entity = (module.exports = {});

entity.createEmbedMessage = createEmbedMessage;
entity.sendEmbedMessage = sendEmbedMessage;

/**
 * Initialize the discord service and handlers.
 *
 * @param {Object} configuration runtime configuration.
 * @return {Promise<void>} A Promise.
 */
entity.init = async (configuration) => {
  await initSnapshot(configuration);
};

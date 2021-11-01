/**
 * @fileoverview Discord relay snapshot proposals.
 */

const {
  init: initSnapshot,
  createEmbedMessage,
  sendEmbedMessage,
} = require('./logic/handle-snapshot-events.ent');

const entity = (module.exports = {});

entity.createEmbedMessage = createEmbedMessage;
entity.sendEmbedMessage = sendEmbedMessage;

/**
 * Initialize the discord service and handlers.
 *
 * @return {Promise<void>} A Promise.
 */
entity.init = async () => {
  await initSnapshot();
};

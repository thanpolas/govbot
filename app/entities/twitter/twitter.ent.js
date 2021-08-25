/**
 * @fileoverview Twitter Business Logic and Service provider.
 * @see https://github.com/desmondmorris/node-twitter
 */

const { init: initService, isConnected } = require('./twitter.service');
const { init: initSnapshot } = require('./logic/handle-snapshot-events.ent');

const entity = (module.exports = {});

entity.isConnected = isConnected;

/**
 * Initialize the twitter service and handlers.
 *
 * @return {Promise<void>} A Promise.
 */
entity.init = async () => {
  initService();
  await initSnapshot();
};

/**
 * @fileoverview Discord relay snapshot proposals.
 */

const { init: initSnapshot } = require('./logic/handle-snapshot-events.ent');

const entity = (module.exports = {});

/**
 * Initialize the twitter service and handlers.
 *
 * @return {Promise<void>} A Promise.
 */
entity.init = async () => {
  await initSnapshot();
};

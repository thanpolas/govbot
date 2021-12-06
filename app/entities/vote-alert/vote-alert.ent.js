/**
 * @fileoverview Vote alerts business logic.
 */

const { init } = require('./logic/handle-create-vote.ent');
const { checkForAlerts } = require('./logic/check-for-alert.ent');

exports.checkForAlerts = checkForAlerts;

/**
 * Initialize the twitter service and handlers.
 *
 * @return {Promise<void>} A Promise.
 */
exports.init = async () => {
  await init();
};

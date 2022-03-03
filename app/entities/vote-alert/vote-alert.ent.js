/**
 * @fileoverview Vote alerts business logic.
 */

const { init } = require('./logic/handle-create-vote.ent');
const { checkForAlerts } = require('./logic/check-for-alert.ent');
const { update } = require('./sql/vote-ends-alert.sql');

exports.checkForAlerts = checkForAlerts;
exports.update = update;

/**
 * Initialize the twitter service and handlers.
 *
 * @return {Promise<void>} A Promise.
 */
exports.init = async () => {
  await init();
};

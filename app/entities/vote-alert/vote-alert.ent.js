/**
 * @fileoverview Vote alerts business logic.
 */

const { init } = require('./logic/handle-create-vote.ent');
const { checkForAlert } = require('./logic/check-for-alert.ent');

exports.checkForAlert = checkForAlert;

/**
 * Initialize the twitter service and handlers.
 *
 * @return {Promise<void>} A Promise.
 */
exports.init = async () => {
  await init();
};

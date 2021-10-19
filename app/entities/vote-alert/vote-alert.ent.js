/**
 * @fileoverview Vote alerts business logic.
 */

const { init } = require('./logic/handle-create-vote.ent');
const { checkForAlert } = require('./logic/check-for-alert.ent');

const entity = (module.exports = {});

entity.checkForAlert = checkForAlert;

/**
 * Initialize the twitter service and handlers.
 *
 * @return {Promise<void>} A Promise.
 */
entity.init = async () => {
  await init();
};

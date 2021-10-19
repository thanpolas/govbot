/**
 * @fileoverview Bootsrap for Entities.
 */

// const discordEnt = require('./discord-helpers');
// const messageRouter = require('./message-router');
const { init: initAdminRelay } = require('./admin-logs');
const { init: initTwitter } = require('./twitter');
const { init: initDiscordRelay } = require('./discord-relay');
const { init: initVoteAlert } = require('./vote-alert');

const bootstrap = (module.exports = {});

/**
 * Bootstrap for Entities.
 *
 * @param {Object} bootOpts Application boot options.
 * @param {boolean} bootOpts.testing When true go into testing mode.
 * @return {Promise} a promise.
 */
bootstrap.init = async (bootOpts) => {
  // await messageRouter.init();
  await initTwitter();
  await initDiscordRelay();
  await initVoteAlert();

  if (bootOpts.testing) {
    return;
  }
  await initAdminRelay(bootOpts);
  // await discordEnt.init();
};

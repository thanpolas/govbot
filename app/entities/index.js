/**
 * @fileoverview Bootsrap for Entities.
 */

// const discordEnt = require('./discord');
// const messageRouter = require('./message-router');
const { init: initAdminRelay } = require('./admin-logs');
const { init: initTwitter } = require('./twitter');

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

  if (bootOpts.testing) {
    return;
  }
  await initAdminRelay(bootOpts);
  // await discordEnt.init();
};

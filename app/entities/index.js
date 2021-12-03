/**
 * @fileoverview Bootsrap for Entities.
 */

const { init: initAdminRelay } = require('./admin-logs');
const { init: initGovbot } = require('./govbot-ctrl');

const bootstrap = (module.exports = {});

/**
 * Bootstrap for Entities.
 *
 * @param {Object} bootOpts Application boot options.
 * @param {boolean} bootOpts.testing When true go into testing mode.
 * @return {Promise} a promise.
 */
bootstrap.init = async (bootOpts) => {
  await initGovbot(bootOpts);

  if (bootOpts.testing) {
    return;
  }
  await initAdminRelay(bootOpts);
};

/**
 * @fileoverview Bootsrap for Entities.
 */

const { init: initGovbot } = require('./govbot-ctrl');
const { init: initEthGovAlerts } = require('./ethgovalerts');

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
  await initEthGovAlerts();
};

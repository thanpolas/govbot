/**
 * @fileoverview Relay log messages to appropriate admin discord channels.
 */

const {
  loggerToAdmin,
  init: initAdminRelay,
} = require('./logic/relay-logs-to-admin.ent');

const entity = (module.exports = {});

entity.loggerToAdmin = loggerToAdmin;

/**
 * Bootstrap for Entities.
 *
 * @param {Object} bootOpts Application boot options.
 * @param {boolean} bootOpts.testing When true go into testing mode.
 * @return {Promise<void>} A Promise.
 */
entity.init = async (bootOpts) => {
  if (bootOpts.testing) {
    return;
  }
  await initAdminRelay();
};

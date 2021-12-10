/**
 * @fileoverview Mocks for the govbot controller.
 */

const govbotCtrlEnt = require('../../app/entities/govbot-ctrl/govbot-ctrl.ent');
const { configurationFix } = require('../fixtures/configuration.fix');

const { getConfigurations } = govbotCtrlEnt;

/**
 * Will mock the getConfigurations() method.
 *
 * @param {Object} opts Options for the configuration fixture.
 * @return {Object} Object with the mock[s] created.
 */
exports.mockGetConfigurations = (opts) => {
  const configuration = configurationFix(opts);
  const getConfigurationsMock = jest.fn(() => Promise.resolve([configuration]));

  govbotCtrlEnt.getConfigurations = getConfigurationsMock;

  return { getConfigurationsMock };
};

/**
 * Restore the getConfigurations() method.
 */
exports.mockGetConfigurationsRestore = () => {
  govbotCtrlEnt.getConfigurations = getConfigurations;
};

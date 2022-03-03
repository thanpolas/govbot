/**
 * @fileoverview Business logic that aggregates multiple protocols into a single
 *    twitter account as a service.
 */

const config = require('config');

const { getEthGovAlertSpaces } = require('./logic/ethgovalerts-spaces.ent');
const { events, eventTypes } = require('../events');

const {
  SNAPSHOT_PROPOSAL_START,
  SNAPSHOT_PROPOSAL_END,
  PROPOSAL_ENDS_IN_ONE_HOUR,
} = eventTypes;

exports.getEthGovAlertSpaces = getEthGovAlertSpaces;

/**
 * Initialize the ethgovalerts functionality if enabled.
 */
exports.init = async () => {
  if (!config.app.has_ethgovalerts) {
    return;
  }

  events.on(
    SNAPSHOT_PROPOSAL_START,
    exports._handleEvent.bind(null, configuration, SNAPSHOT_PROPOSAL_START),
  );
};

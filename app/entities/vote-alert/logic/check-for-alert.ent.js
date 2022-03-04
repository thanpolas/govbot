/**
 * @fileoverview Will check if alert[s] are due and dispatch them.
 */

const { getAlerts, update, deleteMany } = require('../sql/vote-ends-alert.sql');
const { Protocols } = require('../../twitter/constants/protocols.const');
const { events, eventTypes } = require('../../events');
const { getConfigurations } = require('../../govbot-ctrl');
const { indexArrayToObject } = require('../../../utils/helpers');

const log = require('../../../services/log.service').get();

const { PROPOSAL_ENDS_IN_ONE_HOUR } = eventTypes;

/**
 * Will check if alert[s] are due and dispatch them.
 *
 * @return {Promise<void>} A Promise.
 */
exports.checkForAlerts = async () => {
  try {
    const allConfigurations = await getConfigurations();
    const allPendingAlerts = await getAlerts();
    if (!allPendingAlerts.length) {
      return;
    }

    const configurationsIndexed = indexArrayToObject(
      allConfigurations,
      'space',
    );

    // Delete records of spaces not monitored.
    const deleteIds = await exports._deleteNotMonitoredAlerts(
      allPendingAlerts,
      configurationsIndexed,
    );

    const pendingAlerts = allPendingAlerts.filter((alertItem) => {
      if (deleteIds.includes(alertItem.id)) {
        return false;
      }
      // Augmend alerts with their corresponding configuration.
      alertItem.configuration = configurationsIndexed[alertItem.space];

      return true;
    });

    await log.info(
      `checkForAlerts() dispatching ${pendingAlerts.length} vote expiration alert[s]`,
    );

    // dispatch events
    pendingAlerts.forEach((alertItem) => {
      events.emit(PROPOSAL_ENDS_IN_ONE_HOUR, alertItem);
    });

    // Update alert record that it's done
    const updateData = {
      alert_done: true,
    };
    const promises = pendingAlerts.map((alertRecord) =>
      update(alertRecord.id, updateData),
    );
    await Promise.all(promises);
  } catch (ex) {
    await log.error('checkForAlerts() Error', {
      error: ex,
    });
  }
};

/**
 * Deletes not monitored alerts from the DB.
 *
 * @param {Array<Object>} allPendingAlerts All pending alert records.
 * @param {Object} configurationsIndexed Configurations indexed by space id.
 * @return {Promise<Array<string>>} The spaces' IDs that have been deleted.
 * @private
 */
exports._deleteNotMonitoredAlerts = async (
  allPendingAlerts,
  configurationsIndexed,
) => {
  const notFoundSpaces = allPendingAlerts.filter((alertItem) => {
    if (configurationsIndexed[alertItem.space]) {
      // filter out any organizations that no longer require 1h alerts.
      if (!configurationsIndexed[alertItem.space]?.wants_vote_end_alerts) {
        return true;
      }
      return false;
    }

    if (Protocols[alertItem.space]) {
      return false;
    }

    return true;
  });

  if (!notFoundSpaces.length) {
    return notFoundSpaces;
  }

  const deleteIds = allPendingAlerts.map((alert) => alert.id);

  await deleteMany(deleteIds);

  return deleteIds;
};

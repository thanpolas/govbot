/**
 * @fileoverview Handles vote creation events, create appropriate record.
 */

const { events, eventTypes } = require('../../events');

const { create } = require('../sql/vote-ends-alert.sql');

const log = require('../../../services/log.service').get();

const { SNAPSHOT_PROPOSAL_CREATED } = eventTypes;

const entity = (module.exports = {});

/**
 * Listen to events.
 *
 * @return {Promise<void>} A Promise.
 */
entity.init = async () => {
  await log.info('Initializing vote alert, proposal create event handler...');
  events.on(SNAPSHOT_PROPOSAL_CREATED, entity._handleCreateEvent);
};

/**
 * Handles snapshot create proposal events, will create alert record.
 *
 * Needs to handle own errors.
 *
 * @param {Object} proposal The snapshot proposal object.
 * @return {Promise<void>} A Promise.
 * @private
 */
entity._handleCreateEvent = async (proposal) => {
  try {
    const expiresJSTimestamp = Number(proposal.expire) * 1000;
    const expires_at = new Date(expiresJSTimestamp);
    // Alert 1 hour before voting expires
    const alert_at = expiresJSTimestamp - 60 * 60 * 1000;

    const alertData = {
      space: proposal.space,
      expires_at,
      alert_at,
    };

    await create(alertData);

    await log.info(
      `Alert record created for ${proposal.space}, id: ${proposal.id}`,
    );
  } catch (ex) {
    await log.error('_handleCreateEvent Error', {
      error: ex,
      custom: { proposal, error: ex },
    });
  }
};

/**
 * @fileoverview Handles incoming snapshot events from webhook calls.
 */

const { events, eventTypes } = require('../../events');
const tweet = require('./send-tweet.ent');

const log = require('../../../services/log.service').get();

const {
  SNAPSHOT_PROPOSAL_CREATED,
  SNAPSHOT_PROPOSAL_START,
  SNAPSHOT_PROPOSAL_END,
  SNAPSHOT_PROPOSAL_DELETED,
} = eventTypes;

const entity = (module.exports = {});

/**
 * Listen to events.
 *
 * @return {Promise<void>} A Promise.
 */
entity.init = async () => {
  await log.info('Initializing snapshot event handler...');
  events.on(
    SNAPSHOT_PROPOSAL_CREATED,
    entity._handleEvent.bind(null, SNAPSHOT_PROPOSAL_CREATED),
  );
  events.on(
    SNAPSHOT_PROPOSAL_START,
    entity._handleEvent.bind(null, SNAPSHOT_PROPOSAL_START),
  );
  events.on(
    SNAPSHOT_PROPOSAL_END,
    entity._handleEvent.bind(null, SNAPSHOT_PROPOSAL_END),
  );
  events.on(
    SNAPSHOT_PROPOSAL_DELETED,
    entity._handleEvent.bind(null, SNAPSHOT_PROPOSAL_DELETED),
  );
};

/**
 * Handles snapshot events, needs to handle own errors.
 *
 * @param {string} eventType The event type to handle.
 * @param {Object} proposal The snapshot proposal object.
 * @return {Promise<void>} A Promise.
 * @private
 */
entity._handleEvent = async (eventType, proposal) => {
  try {
    let message = '';
    switch (eventType) {
      case SNAPSHOT_PROPOSAL_CREATED:
        message = tweet.prepareMessage(
          '🆕 Proposal CREATED on Snapshot',
          proposal.title,
          proposal.link,
        );
        break;
      case SNAPSHOT_PROPOSAL_START:
        message = tweet.prepareMessage(
          '📢 Proposal now ACTIVE on Snapshot',
          proposal.title,
          proposal.link,
        );
        break;
      case SNAPSHOT_PROPOSAL_END:
        message = tweet.prepareMessage(
          '⛔ Proposal ENDED on Snapshot',
          proposal.title,
          proposal.link,
        );
        break;
      case SNAPSHOT_PROPOSAL_DELETED:
        message = tweet.prepareMessage(
          '❌ Proposal DELETED on Snapshot',
          proposal.title,
          proposal.link,
        );
        break;
      default:
        await log.warn(`_handleEvent() Bogus event type: "${eventType}"`);
        return;
    }

    const res = await tweet.sendTweet(message);

    await log.info(`Tweet sent for event ${eventType}, twitter id ${res.id}`);
  } catch (ex) {
    await log.error('_handleEvent Error', {
      error: ex,
      custom: { proposal, error: ex },
    });
  }
};

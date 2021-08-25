/**
 * @fileoverview Handles incoming snapshot events from webhook calls.
 */
const truncate = require('truncate');

const { events, eventTypes } = require('../../events');
const tweet = require('./send-tweet.ent');

const {
  MAX_CHARS,
  URL_LENGTH,
  ELIPSES_LENGTH,
} = require('../constants/twitter.const');

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
    let messageTemplateSize = URL_LENGTH + ELIPSES_LENGTH;
    let availableSize = 0;
    let proposalName = '';
    switch (eventType) {
      case SNAPSHOT_PROPOSAL_CREATED:
        messageTemplateSize += 37;
        availableSize = MAX_CHARS - messageTemplateSize;
        proposalName = truncate(proposal.title, availableSize);
        message = `🆕 Proposal CREATED on Snapshot:\n\n"${proposalName}"\n\n${proposal.link}`;
        break;
      case SNAPSHOT_PROPOSAL_START:
        messageTemplateSize += 40;
        availableSize = MAX_CHARS - messageTemplateSize;
        proposalName = truncate(proposal.title, availableSize);
        message = `📢 Proposal now ACTIVE on Snapshot:\n\n"${proposalName}"\n\n${proposal.link}`;
        break;
      case SNAPSHOT_PROPOSAL_END:
        messageTemplateSize += 34;
        availableSize = MAX_CHARS - messageTemplateSize;
        proposalName = truncate(proposal.title, availableSize);
        message = `⛔ Proposal ENDED on Snapshot:\n\n"${proposalName}"\n\n${proposal.link}`;
        break;
      case SNAPSHOT_PROPOSAL_DELETED:
        messageTemplateSize += 34;
        availableSize = MAX_CHARS - messageTemplateSize;
        proposalName = truncate(proposal.title, availableSize);
        message = `❌ Proposal DELETED on Snapshot:\n\n"${proposalName}"`;
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

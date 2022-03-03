/**
 * @fileoverview Handles incoming snapshot events from webhook calls.
 */

const { events, eventTypes } = require('../../events');
const sendTweetEnt = require('./send-tweet.ent');
const { update: updateAlert } = require('../../vote-alert');

const log = require('../../../services/log.service').get();

const {
  SNAPSHOT_PROPOSAL_CREATED,
  SNAPSHOT_PROPOSAL_START,
  SNAPSHOT_PROPOSAL_END,
  SNAPSHOT_PROPOSAL_DELETED,
  PROPOSAL_ENDS_IN_ONE_HOUR,
} = eventTypes;

const entity = (module.exports = {});

/**
 * Listen to events.
 *
 * @param {Object} configuration The configuration of this instance.
 * @return {Promise<void>} A Promise.
 */
entity.init = async (configuration) => {
  if (!configuration.has_twitter) {
    return;
  }
  await log.info(
    `Initializing snapshot event handler for ${configuration.space}...`,
  );

  events.on(
    SNAPSHOT_PROPOSAL_CREATED,
    entity._handleEvent.bind(null, SNAPSHOT_PROPOSAL_CREATED, configuration),
  );
  events.on(
    SNAPSHOT_PROPOSAL_START,
    entity._handleEvent.bind(null, SNAPSHOT_PROPOSAL_START, configuration),
  );
  events.on(
    SNAPSHOT_PROPOSAL_END,
    entity._handleEvent.bind(null, SNAPSHOT_PROPOSAL_END, configuration),
  );
  events.on(
    SNAPSHOT_PROPOSAL_DELETED,
    entity._handleEvent.bind(null, SNAPSHOT_PROPOSAL_DELETED, configuration),
  );
  events.on(
    PROPOSAL_ENDS_IN_ONE_HOUR,
    exports._handleAlertEvent.bind(null, configuration),
  );
};

/**
 * Handles snapshot events, needs to handle own errors.
 *
 * @param {string} eventType The event type to handle.
 * @param {Object} configuration The configuration of this instance.
 * @param {Object} proposal The snapshot proposal object.
 * @return {Promise<void>} A Promise.
 * @private
 */
entity._handleEvent = async (eventType, configuration, proposal) => {
  try {
    // Check if proposal is for the current configuration.
    if (proposal.space.id !== configuration.space) {
      return;
    }

    // Check if twitter integration exists for this configuration
    if (!configuration.has_twitter) {
      return;
    }

    let message = '';
    switch (eventType) {
      case SNAPSHOT_PROPOSAL_START:
        message = await sendTweetEnt.prepareMessage(
          '📢 Voting STARTED for proposal',
          configuration,
          proposal.title,
          proposal.link,
        );
        break;
      case SNAPSHOT_PROPOSAL_END:
        message = await sendTweetEnt.prepareMessage(
          '⛔ Voting ENDED for proposal',
          configuration,
          proposal.title,
          proposal.link,
        );
        break;
      default:
        await log.warn(`_handleEvent() Bogus event type: "${eventType}"`);
        return;
    }

    if (!message) {
      return;
    }

    const res = await sendTweetEnt.sendTweet(configuration, message);

    await log.info(
      `Tweet sent for event ${eventType}, space: ${configuration.space}, twitter id ${res.id}`,
    );
  } catch (ex) {
    await log.error(
      `_handleEvent() Twitter Error for space: ${configuration.space}`,
      {
        error: ex,
        custom: { proposal, error: ex },
      },
    );
  }
};

/**
 * Handle a vote end alert, dispatch warning.
 *
 * @param {Object} configurationInst This is the configuration  this particular
 *    runtime is responsible for.
 * @param {Object} alertRecord The alert record to handle.
 * @return {Promise<void>}
 * @private
 */
exports._handleAlertEvent = async (configurationInst, alertRecord) => {
  try {
    const { configuration } = alertRecord;
    if (configuration.space !== configurationInst.space) {
      return;
    }
    const tweetMessage = await sendTweetEnt.prepareMessage(
      '⏰ Less than an hour left to vote on',
      configuration,
      alertRecord.title,
      alertRecord.link,
    );

    await sendTweetEnt.sendTweet(configuration, tweetMessage);

    const updateData = {
      alert_twitter_dispatched: true,
    };

    await updateAlert(alertRecord.id, updateData);
  } catch (ex) {
    await log.error('_handleAlertEvent() twitter Error', {
      error: ex,
      custom: { alertRecord },
    });
  }
};

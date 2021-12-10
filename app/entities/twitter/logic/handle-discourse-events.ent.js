/**
 * @fileoverview Handles incoming discourse events from webhook calls.
 */

const { events, eventTypes } = require('../../events');
const tweet = require('./send-tweet.ent');

const log = require('../../../services/log.service').get();

const { DISCOURSE_NEW_TOPIC } = eventTypes;

const entity = (module.exports = {});

/**
 * Listen to events.
 *
 * @param {Object} configuration The configuration of this instance.
 * @return {Promise<void>} A Promise.
 */
entity.init = async (configuration) => {
  if (
    !configuration.has_twitter ||
    !configuration.wants_discourse_integration
  ) {
    return;
  }
  await log.info(
    `Initializing twitter discourse event handler for ${configuration.space}...`,
  );

  events.on(DISCOURSE_NEW_TOPIC, entity._handleEvent.bind(null, configuration));
};

/**
 * Handles discourse events, needs to handle own errors.
 *
 * @param {Object} configuration The configuration of this instance.
 * @param {Object} discourseTopic The discourse topic data object (webhook payload).
 * @return {Promise<void>} A Promise.
 * @private
 */
entity._handleEvent = async (configuration, discourseTopic) => {
  try {
    // Check if event is for the current configuration.
    if (discourseTopic.space !== configuration.space) {
      return;
    }

    // Check if twitter integration exists for this configuration
    if (!configuration.has_twitter) {
      return;
    }

    const message = await tweet.prepareMessage(
      '📫 New topic posted',
      configuration,
      discourseTopic.title,
      discourseTopic.link,
    );

    const res = await tweet.sendTweet(configuration, message);

    await log.info(
      `Tweet sent for new discourse topic, space: ${configuration.space}, twitter id ${res.id}`,
    );
  } catch (ex) {
    await log.error(
      `Discourse _handleEvent() Error for space: ${configuration.space}`,
      {
        error: ex,
        custom: { discourseTopic, error: ex },
      },
    );
  }
};

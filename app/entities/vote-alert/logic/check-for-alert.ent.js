/**
 * @fileoverview Will check if alert[s] are due and dispatch them.
 */

const { config } = require('bluebird');
const BPromise = require('bluebird');

const { getAlerts, update } = require('../sql/vote-ends-alert.sql');
const { sendTweet, prepareMessage } = require('../../twitter');
const { createEmbedMessage, sendEmbedMessage } = require('../../discord-relay');
const { eventTypes } = require('../../events');

const log = require('../../../services/log.service').get();

const { PROPOSAL_ENDS_IN_ONE_HOUR } = eventTypes;

const entity = (module.exports = {});

/**
 * Will check if alert[s] are due and dispatch them.
 *
 * @return {Promise<void>} A Promise.
 */
entity.checkForAlert = async () => {
  try {
    const allPendingAlerts = await getAlerts();
    if (!allPendingAlerts.length) {
      return;
    }

    const pendingAlerts = allPendingAlerts.filter((alert) => {
      return config.apply.spaces_to_alert.includes(alert.space);
    });

    if (!pendingAlerts.length) {
      return;
    }

    await BPromise.mapSeries(pendingAlerts, entity._dispatchAlert);

    await log.info(
      `checkForAlert() dispatched ${pendingAlerts.length} vote expiration alert[s]`,
    );
  } catch (ex) {
    await log.error('checkForalert Error', {
      error: ex,
    });
  }
};

/**
 * Will dispatch message and save to db.
 *
 * @param {Object} alertRecord The alert record to dispatch.
 * @return {Promise<void>} A Promise.
 * @private
 */
entity._dispatchAlert = async (alertRecord) => {
  const [tweeter, discord] = Promise.allSettled([
    entity._dispatchTweet(alertRecord),
    entity._dispatchDiscord(alertRecord),
  ]);

  if (tweeter.status === 'fulfilled' && discord.status === 'fulfilled') {
    const updateData = {
      alert_done: true,
    };

    await update(alertRecord.id, updateData);
  }
};

/**
 * Dispatch Tweet.
 *
 * @param {Object} alertRecord The alert record to dispatch.
 * @return {Promise<void>} A Promise.
 * @private
 */
entity._dispatchTweet = async (alertRecord) => {
  const tweetMessage = prepareMessage(
    '⏰ Less than an hour left to vote on',
    alertRecord.title,
    alertRecord.link,
  );

  await sendTweet(tweetMessage);

  const updateData = {
    alert_twitter_dispatched: true,
  };

  await update(alertRecord.id, updateData);
};

/**
 * Dispatch discord message.
 *
 * @param {Object} alertRecord The alert record to dispatch.
 * @return {Promise<void>} A Promise.
 * @private
 */
entity._dispatchDiscord = async (alertRecord) => {
  const embedMessage = await createEmbedMessage(
    PROPOSAL_ENDS_IN_ONE_HOUR,
    alertRecord,
  );
  await sendEmbedMessage(embedMessage);

  const updateData = {
    alert_discord_dispatched: true,
  };

  await update(alertRecord.id, updateData);
};
